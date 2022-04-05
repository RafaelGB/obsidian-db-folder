import {
	Notice,
	Plugin,
	Component,
	MarkdownPostProcessorContext,
	TFolder,
	TFile
} from 'obsidian';

import{
	databaseViewType,
	DatabaseView,
	databaseIcon
} from 'DatabaseView';

import {
	DEFAULT_SETTINGS,
	Settings,
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

export default class DBFolderPlugin extends Plugin {
	/** Plugin-wide default settings. */
	public settings: Settings;

	/** External-facing plugin API */
	public api: DbfAPIInterface;

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
	async updateSettings(settings: Partial<Settings>) {
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