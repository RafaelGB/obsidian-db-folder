import {
	WorkspaceLeaf,
	Plugin,
	MarkdownPostProcessorContext,
	TFolder,
	TFile,
	ViewState,
} from 'obsidian';

import {
	DatabaseView,
	databaseIcon
} from 'DatabaseView';

import {
	DBFolderSettingTab,
	loadServicesThatRequireSettings
} from 'Settings';

import {
	DbfAPIInterface
} from 'typings/api';

import { DatabaseSettings, LocalSettings } from 'cdm/SettingsModel';

import StateManager from 'StateManager';
import { around } from 'monkey-around';
import { LOGGER } from 'services/Logger';
import { DatabaseCore, DatabaseFrontmatterOptions, DEFAULT_SETTINGS, YAML_INDENT } from 'helpers/Constants';
import { PreviewDatabaseModeService } from 'services/MarkdownPostProcessorService';
import { unmountComponentAtNode } from 'react-dom';

interface WindowRegistry {
	viewMap: Map<string, DatabaseView>;
	viewStateReceivers: Array<(views: DatabaseView[]) => void>;
	appRoot: HTMLElement;
}

export default class DBFolderPlugin extends Plugin {
	/** Plugin-wide default settings. */
	public settings: DatabaseSettings;

	/** External-facing plugin API */
	public api: DbfAPIInterface;

	public hover: { linkText: string; sourcePath: string } = {
		linkText: null,
		sourcePath: null,
	};

	databaseFileModes: Record<string, string> = {};

	viewMap: Map<string, DatabaseView> = new Map();

	_loaded = false;

	stateManagers: Map<TFile, StateManager> = new Map();

	windowRegistry: Map<Window, WindowRegistry> = new Map();

	async onload(): Promise<void> {
		await this.load_settings();

		this.registerEvent(
			app.workspace.on('window-open', (_: any, win: Window) => {
				this.mount(win);
			})
		);

		this.registerEvent(
			app.workspace.on('window-close', (_: any, win: Window) => {
				this.unmount(win);
			})
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new DBFolderSettingTab(this, {
			onSettingsChange: async (newSettings) => {
				this.settings = newSettings;
				await this.saveSettings();

				//Force a complete re-render when settings change
				this.stateManagers.forEach((stateManager) => {
					stateManager.forceRefresh();
				});
			},
		})
		);

		this.registerView(DatabaseCore.FRONTMATTER_KEY, (leaf) => new DatabaseView(leaf, this));
		this.registerEvents();
		this.registerMonkeyPatches();
		this.addMarkdownPostProcessor();
		// Mount an empty component to start; views will be added as we go
		this.mount(window);

		(app.workspace as any).floatingSplit?.children?.forEach((c: any) => {
			this.mount(c.win);
		});
	}

	async onunload() {
		this.windowRegistry.forEach((reg, win) => {
			reg.viewStateReceivers.forEach((fn) => fn([]));
			this.unmount(win);
		});
		LOGGER.info('Unloading DBFolder plugin');
		// Unmount views first
		this.stateManagers.clear();
		this.unmount(window);
		this.windowRegistry.clear();
	}

	/** Update plugin settings. */
	async updateSettings(settings: Partial<DatabaseSettings>) {
		Object.assign(this.settings, settings);
		await this.saveData(this.settings);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async load_settings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
		loadServicesThatRequireSettings(this.settings);
	}

	public registerPriorityCodeblockPostProcessor(
		language: string,
		priority: number,
		processor: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<void>
	) {
		const registered = this.registerMarkdownCodeBlockProcessor(language, processor);
		registered.sortOrder = priority;
	}

	async setDatabaseView(leaf: WorkspaceLeaf) {
		await leaf.setViewState({
			type: DatabaseCore.FRONTMATTER_KEY,
			state: leaf.view.getState(),
			popstate: true,
		} as ViewState);
	}

	viewStateReceivers: Array<(views: DatabaseView[]) => void> = [];

	addView(view: DatabaseView, data: string, shouldParseData: boolean) {
		const win = view.getWindow();
		const reg = this.windowRegistry.get(win);

		if (!reg) {
			return;
		}

		if (!this.viewMap.has(view.id)) {
			this.viewMap.set(view.id, view);
		}

		const file = view.file;

		if (this.stateManagers.has(file)) {
			this.stateManagers.get(file).registerView(view, data, shouldParseData);
		} else {
			this.stateManagers.set(
				file,
				new StateManager(
					view,
					data,
					() => this.stateManagers.delete(file),
					() => this.settings
				)
			);
		}
		reg.viewStateReceivers.forEach((fn) => fn(this.getDatabaseViews(win)));
	}

	getStateManager(file: TFile) {
		return this.stateManagers.get(file);
	}

	removeView(view: DatabaseView) {
		const entry = Array.from(this.windowRegistry.entries()).find(([, reg]) => {
			return reg.viewMap.has(view.id);
		}, []);

		if (!entry) {
			return;
		}

		const [win, reg] = entry;
		const file = view.file;

		if (reg.viewMap.has(view.id)) {
			reg.viewMap.delete(view.id);
		}

		if (this.stateManagers.has(file)) {
			this.stateManagers.get(file).unregisterView(view);
			reg.viewStateReceivers.forEach((fn) => fn(this.getDatabaseViews(win)));
		}
	}

	unmount(win: Window) {
		if (!this.windowRegistry.has(win)) {
			return;
		}

		const reg = this.windowRegistry.get(win);

		for (const view of reg.viewMap.values()) {
			view.destroy();
		}

		unmountComponentAtNode(reg.appRoot);

		reg.appRoot.remove();
		reg.viewMap.clear();
		reg.viewStateReceivers.length = 0;
		reg.appRoot = null;

		this.windowRegistry.delete(win);
	}

	async setMarkdownView(leaf: WorkspaceLeaf, focus = true) {
		await leaf.setViewState(
			{
				type: 'markdown',
				state: leaf.view.getState(),
				popstate: true,
			} as ViewState,
			{ focus }
		);
	}

	getDatabaseViews(win: Window) {
		const reg = this.windowRegistry.get(win);

		if (reg) {
			return Array.from(reg.viewMap.values());
		}

		return [];
	}

	getDatabaseView(id: string) {
		return this.viewMap.get(id);
	}

	mount(win: Window) {
		if (this.windowRegistry.has(win)) {
			return;
		}

		const el = win.document.body.createDiv();

		this.windowRegistry.set(win, {
			viewMap: new Map(),
			viewStateReceivers: [],
			appRoot: el,
		});

		//Preact.render(createApp(win, this), el);
	}

	async newDatabase(folder?: TFolder) {
		const targetFolder = folder
			? folder
			: this.app.fileManager.getNewFileParent(
				this.app.workspace.getActiveFile()?.path || ''
			);

		try {
			const database: TFile = await (
				this.app.fileManager as any
			).createNewMarkdownFile(targetFolder, 'Untitled database');

			await app.vault.modify(
				database,
				DatabaseFrontmatterOptions.BASIC
					.concat('\n')
					.concat(this.defaultConfiguration())
			);
			await app.workspace.getMostRecentLeaf().setViewState({
				type: DatabaseCore.FRONTMATTER_KEY,
				state: { file: database.path },
			});
		} catch (e) {
			LOGGER.error('Error creating database folder:', e);
		}
	}

	/**
	 * Returns the default configuration for a database file.
	 */
	defaultConfiguration(): string {
		const local_settings = this.settings.local_settings;
		const defaultConfig = [];
		defaultConfig.push("config:");
		Object.entries(DEFAULT_SETTINGS.local_settings).forEach(([key, value]) => {
			const defaultValue = local_settings[key as keyof LocalSettings] !== undefined ? local_settings[key as keyof LocalSettings] : value;
			defaultConfig.push(`${YAML_INDENT}${key}: ${defaultValue}`);
		});
		defaultConfig.push("%%>");
		return defaultConfig.join('\n');
	}

	registerEvents() {
		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file: TFile) => {
				// Add a menu item to the folder context menu to create a database
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item
							.setTitle('New database folder')
							.setIcon(databaseIcon)
							.onClick(() => this.newDatabase(file));
					});
				}
			})
		);
	}

	/**
	   * Displays a transcluded .excalidraw image in markdown preview mode
	   */
	private addMarkdownPostProcessor() {
		const previewMode = PreviewDatabaseModeService.getInstance(this);
		this.registerMarkdownPostProcessor(previewMode.markdownPostProcessor);

		// internal-link quick preview
		this.registerEvent(app.workspace.on("quick-preview", previewMode.hoverEvent));

		//monitoring for div.popover.hover-popover.file-embed.is-loaded to be added to the DOM tree
		// this.observer = observer;
		// this.observer.observe(document, { childList: true, subtree: true });
	}

	/**
	 * Wrap Obsidian functionalities to add the database support needed
	 */
	registerMonkeyPatches() {
		const self = this;

		// Monkey patch WorkspaceLeaf to open Databases with DatabaseView by default
		this.register(
			around(WorkspaceLeaf.prototype, {
				// Databases can be viewed as markdown or Database, and we keep track of the mode
				// while the file is open. When the file closes, we no longer need to keep track of it.
				detach(next) {
					return function () {
						const state = this.view?.getState();

						if (state?.file && self.databaseFileModes[this.id || state.file]) {
							delete self.databaseFileModes[this.id || state.file];
						}

						return next.apply(this);
					};
				},

				setViewState(next) {
					return function (state: ViewState, ...rest: any[]) {
						if (
							// Don't force Databases mode during shutdown
							self._loaded &&
							// If we have a markdown file
							state.type === 'markdown' &&
							state.state?.file &&
							// And the current mode of the file is not set to markdown
							self.databaseFileModes[this.id || state.state.file] !== 'markdown'
						) {
							// Then check for the database frontMatterKey
							const cache = self.app.metadataCache.getCache(state.state.file);

							if (cache?.frontmatter && cache.frontmatter[DatabaseCore.FRONTMATTER_KEY]) {
								// If we have it, force the view type to database
								const newState = {
									...state,
									type: DatabaseCore.FRONTMATTER_KEY,
								};

								self.databaseFileModes[state.state.file] = DatabaseCore.FRONTMATTER_KEY;

								return next.apply(this, [newState, ...rest]);
							}
						}

						return next.apply(this, [state, ...rest]);
					};
				},
			})
		);

		// //Add a menu item to go back to database view
		// this.register(
		// 	around(MarkdownView.prototype, {
		// 		onPaneMenu(next) {
		// 			return function (menu: Menu) {
		// 				const file = this.file;
		// 				const cache = file
		// 					? self.app.metadataCache.getFileCache(file)
		// 					: null;

		// 				if (
		// 					!file ||
		// 					!cache?.frontmatter ||
		// 					!cache.frontmatter[DatabaseCore.FRONTMATTER_KEY]
		// 				) {
		// 					return next.call(this, menu);
		// 				}

		// 				menu
		// 					.addItem((item) => {
		// 						item
		// 							.setTitle('Open as database folder')
		// 							.setIcon(databaseIcon)
		// 							.onClick(() => {
		// 								self.databaseFileModes[this.leaf.id || file.path] =
		// 									DatabaseCore.FRONTMATTER_KEY;
		// 								self.setDatabaseView(this.leaf);
		// 							});
		// 					})
		// 					.addSeparator();

		// 				next.call(this, menu);
		// 			};
		// 		},
		// 	})
		// );
	}

	// private debuggingMobile(plugin:Plugin){
	// 	// Call this method inside your plugin's `onLoad` function
	// 	function monkeyPatchConsole(plugin: Plugin) {

	// 		if (!plugin.app.isMobile) {
	// 			return;
	// 		}

	// 		const logFile = `${plugin.manifest.dir}/logs.txt`;
	// 		const logs: string[] = [];
	// 		const logMessages = (prefix: string) => (...messages: unknown[]) => {
	// 			logs.push(`\n[${prefix}]`);
	// 			for (const message of messages) {
	// 				logs.push(String(message));
	// 			}
	// 			plugin.app.vault.adapter.write(logFile, logs.join(" "));
	// 		};

	// 		console.debug = logMessages("debug");
	// 		console.error = logMessages("error");
	// 		console.info = logMessages("info");
	// 		console.log = logMessages("log");
	// 		console.warn = logMessages("warn");
	// 	}
	// }
}