import {
	WorkspaceLeaf,
	Plugin,
	Component,
	MarkdownPostProcessorContext,
	TFolder,
	TFile,
	ViewState,
	MarkdownView,
	Menu
} from 'obsidian';

import{
	databaseViewType,
	DatabaseView,
	databaseIcon
} from 'DatabaseView';

import {
	DEFAULT_SETTINGS,
	DatabaseSettings,
	DBFolderSettingTab
} from 'Settings';

import {
	DbfAPIInterface
} from 'typings/api';

import {
	DBFolderAPI
}from 'api/plugin-api';

import {
	DBFolderListRenderer
} from 'EmbedDatabaseFolder';

import {
	parseDatabase
} from 'parsers/YamlParser';

import {
	DatabaseType
} from 'parsers/handlers/TypeHandler';

import {
	DbFolderError
} from 'errors/AbstractError';
import { basicFrontmatter, frontMatterKey } from 'parsers/DatabaseParser';
import { StateManager } from 'StateManager';
import { around } from 'monkey-around';

export default class DBFolderPlugin extends Plugin {
	/** Plugin-wide default settings. */
	public settings: DatabaseSettings;

	/** External-facing plugin API */
	public api: DbfAPIInterface;

	databaseFileModes: Record<string, string> = {};

	viewMap: Map<string, DatabaseView> = new Map();

	_loaded: boolean = false;

	stateManagers: Map<TFile, StateManager> = new Map();
	
	async onload(): Promise<void> {
		await this.load_settings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new DBFolderSettingTab(this.app, this));
		
		// This registers a code block processor that will be called when the user types `<code>` in markdown.
		this.registerPriorityCodeblockPostProcessor("dbfolder", -100, async (source: string, el, ctx) =>
			this.dbfolder(source, el, ctx, ctx.sourcePath)
		);

		this.registerView(databaseViewType, (leaf) => new DatabaseView(leaf, this));
		this.registerEvents();
		this.registerMonkeyPatches();
		this.api = new DBFolderAPI(this.app, this.settings);
	}

	async onunload() {
		console.log('Unloading DBFolder plugin');
	}

	/** Update plugin settings. */
	async updateSettings(settings: Partial<DatabaseSettings>) {
		Object.assign(this.settings, settings);
		await this.saveData(this.settings);
	}

	async load_settings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	public registerPriorityCodeblockPostProcessor(
		language: string,
		priority: number,
		processor: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<void>
	) {
		let registered = this.registerMarkdownCodeBlockProcessor(language, processor);
		registered.sortOrder = priority;
	}

	public async dbfolder(
		source: string,
		el: HTMLElement,
		component: Component | MarkdownPostProcessorContext,
		sourcePath: string
	) {
		try {
			let databaseYaml = await parseDatabase(source, this.app);
			switch (databaseYaml.type as DatabaseType) {
				case DatabaseType.LIST:
					component.addChild(
						new DBFolderListRenderer(el, databaseYaml, sourcePath, this.settings,this.app)
					);
					break;
				case DatabaseType.BOARD:
					// TODO
					console.warn('not implemented yet');
					break;
				default:
					console.error('something went wrong rendering dbfolder');
			}
		} catch (e) {
			switch(true){
				case e instanceof DbFolderError:
					e.render(el);
					break;
				default:
					console.error(e);
			}
		}
	}

	async setDatabaseView(leaf: WorkspaceLeaf) {
		await leaf.setViewState({
		  type: databaseViewType,
		  state: leaf.view.getState(),
		  popstate: true,
		} as ViewState);
	  }
	  
	viewStateReceivers: Array<(views: DatabaseView[]) => void> = [];

	addView(view: DatabaseView, data: string, shouldParseData: boolean) {
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
			  this.app,
			  view,
			  data,
			  () => this.stateManagers.delete(file),
			  () => this.settings
			)
		  );
		}
	
		this.viewStateReceivers.forEach((fn) => fn(this.getDatabaseViews()));
	  }

	getStateManager(file: TFile) {
		return this.stateManagers.get(file);
	}

	removeView(view: DatabaseView) {
		const file = view.file;
	
		if (this.viewMap.has(view.id)) {
		  this.viewMap.delete(view.id);
		}
	
		if (this.stateManagers.has(file)) {
		  this.stateManagers.get(file).unregisterView(view);
		  this.viewStateReceivers.forEach((fn:any) => fn(this.getDatabaseViews()));
		}
	  }

	async setMarkdownView(leaf: WorkspaceLeaf, focus: boolean = true) {
		await leaf.setViewState(
		  {
			type: 'markdown',
			state: leaf.view.getState(),
			popstate: true,
		  } as ViewState,
		  { focus }
		);
	}

	getDatabaseViews() {
	return Array.from(this.viewMap.values());
	}

	getDatabaseView(id: string) {
	return this.viewMap.get(id);
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
	
		  await this.app.vault.modify(database, basicFrontmatter);
		  await this.app.workspace.activeLeaf.setViewState({
			type: databaseViewType,
			state: { file: database.path },
		  });
		} catch (e) {
		  console.error('Error creating database folder:', e);
		}
	}

	registerEvents() {
		this.registerEvent(
		  this.app.workspace.on('file-menu', (menu, file: TFile) => {
			// Add a menu item to the folder context menu to create a board
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

	registerMonkeyPatches() {
		const self = this;
	
		this.app.workspace.onLayoutReady(() => {
		  this.register(
			around((this.app as any).commands, {
			  executeCommandById(next) {
				return function (command: string) {
				  const view = self.app.workspace.getActiveViewOfType(DatabaseView);
	
				  if (view) {
					//view.emitter.emit('hotkey', command);
				  }
	
				  return next.call(this, command);
				};
			  },
			})
		  );
		});
	
		// Monkey patch WorkspaceLeaf to open Kanbans with KanbanView by default
		this.register(
		  around(WorkspaceLeaf.prototype, {
			// Kanbans can be viewed as markdown or kanban, and we keep track of the mode
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
				  // Don't force kanban mode during shutdown
				  self._loaded &&
				  // If we have a markdown file
				  state.type === 'markdown' &&
				  state.state?.file &&
				  // And the current mode of the file is not set to markdown
				  self.databaseFileModes[this.id || state.state.file] !== 'markdown'
				) {
				  // Then check for the kanban frontMatterKey
				  const cache = self.app.metadataCache.getCache(state.state.file);
	
				  if (cache?.frontmatter && cache.frontmatter[frontMatterKey]) {
					// If we have it, force the view type to kanban
					const newState = {
					  ...state,
					  type: databaseViewType,
					};
	
					self.databaseFileModes[state.state.file] = databaseViewType;
	
					return next.apply(this, [newState, ...rest]);
				  }
				}
	
				return next.apply(this, [state, ...rest]);
			  };
			},
		  })
		);
	
		// Add a menu item to go back to database view
		this.register(
		  around(MarkdownView.prototype, {
			onMoreOptionsMenu(next) {
			  return function (menu: Menu) {
				const file = this.file;
				const cache = file
				  ? self.app.metadataCache.getFileCache(file)
				  : null;
	
				if (
				  !file ||
				  !cache?.frontmatter ||
				  !cache.frontmatter[frontMatterKey]
				) {
				  return next.call(this, menu);
				}
	
				menu
				  .addItem((item) => {
					item
					  .setTitle('Open as kanban board')
					  .setIcon(databaseIcon)
					  .onClick(() => {
						self.databaseFileModes[this.leaf.id || file.path] =
						databaseViewType;
						self.setDatabaseView(this.leaf);
					  });
				  })
				  .addSeparator();
	
				next.call(this, menu);
			  };
			},
		  })
		);
	  }
}