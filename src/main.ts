import {
	App,
	Modal,
	Notice,
	Plugin,
	Component,
	MarkdownPostProcessorContext
} from 'obsidian';

import {
	DEFAULT_SETTINGS,
	Settings,
	DBFolderSettingTab
} from 'Settings';

import {
	DBFolderListRenderer
} from 'DBFolder';

import {
	parseDatabase
} from 'parse/Parser';

import {
	DatabaseType
} from 'parse/handlers/TypeHandler';

import {
	ParserError
} from 'errors/ParserError';

export default class DBFolderPlugin extends Plugin {
	settings: Settings;
	async onload(): Promise<void> {
		await this.load_settings();

		// This creates an icon in the left ribbon.
		let ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new DBFolderSettingTab(this.app, this));
		
		this.registerPriorityCodeblockPostProcessor("dbfolder", -100, async (source: string, el, ctx) =>
			this.dbfolder(source, el, ctx, ctx.sourcePath)
		);

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new DBFolderModalCreate(this.app).open();
			}
		});
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
				case e instanceof ParserError:
					console.error(e.getErrorsList());
					break;
				default:
					console.error(e);
			}
		}
	}
}

class DBFolderModalCreate extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		/*
			http Form where user can add, edit or delete properties with the format name-type asociated with a db folder
		*/
		contentEl.innerHTML = `
			<div class="modal-content">
				<div class="modal-header">
					<h3>DB Folder Properties</h3>
				</div>
				<div class="modal-body">
					<form id="db-folder-properties-form">
						<div class="form-group">
							<label for="db-folder-name">DB Folder Name</label>
							<input type="text" class="form-control" id="db-folder-name" placeholder="Enter DB Folder Name">
						</div>
						<div class="form-group">
							<label for="db-folder-type">DB Folder Type</label>
							<select class="form-control" id="db-folder-type">
								<option>String</option>
								<option>Number</option>
								<option>Boolean</option>
								<option>Date</option>
								<option>Array</option>
								<option>Object</option>
							</select>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" id="db-folder-properties-submit">Submit</button>
					<button type="button" class="btn btn-secondary" id="db-folder-properties-cancel">Cancel</button>
				</div>
			</div>
		`;
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}