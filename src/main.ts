import {
	WorkspaceLeaf,
	Plugin,
	Component,
	MarkdownPostProcessorContext,
	TFolder,
	TFile,
	ViewState
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
import { basicFrontmatter } from 'parsers/DatabaseParser';
import { StateManager } from 'StateManager';

export default class DBFolderPlugin extends Plugin {
	/** Plugin-wide default settings. */
	public settings: DatabaseSettings;

	/** External-facing plugin API */
	public api: DbfAPIInterface;

	databaseFileModes: Record<string, string> = {};

	viewMap: Map<string, DatabaseView> = new Map();

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
		  ).createNewMarkdownFile(targetFolder, 'Untitled Kanban');
	
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
}