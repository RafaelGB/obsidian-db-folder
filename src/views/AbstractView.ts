import { DataApi } from "api/data-api";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { UpdaterData, ViewEvents } from "cdm/EmitterModel";
import { InitialType, RowDataType, TableColumn, TableDataType } from "cdm/FolderModel";
import { obtainMetadataColumns } from "components/Columns";
import { createDatabase } from "components/index/Database";
import { DbFolderException } from "errors/AbstractException";
import { DatabaseCore, DB_ICONS, EMITTERS_BAR_STATUS, EMITTERS_GROUPS, EMITTERS_SHORTCUT, InputType } from "helpers/Constants";
import { createEmitter, Emitter } from "helpers/Emitter";
import { c } from "helpers/StylesHelper";
import { isDatabaseNote } from "helpers/VaultManagement";
import { getParentWindow } from "helpers/WindowElement";
import { t } from "lang/helpers";
import DBFolderPlugin from "main";
import { HoverParent, HoverPopover, Menu, Platform, TextFileView, TFile, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import DatabaseInfo from "services/DatabaseInfo";
import { LOGGER } from "services/Logger";
import { SettingsModal } from "Settings";
import StateManager from "StateManager";
import DefaultDataImpl from "./impl/DefaultDataImpl";

export abstract class CustomView extends TextFileView implements HoverParent {
    plugin: DBFolderPlugin;
    hoverPopover: HoverPopover | null;
    emitter: Emitter<ViewEvents>;
    tableContainer: HTMLDivElement | null = null;
    rootContainer: Root | null = null;
    diskConfig: DatabaseInfo;
    shadowColumns: Array<TableColumn>;
    initial: InitialType;
    formulas: Record<string, unknown>;
    actionButtons: Record<string, HTMLElement> = {};
    dataApi: DataApi;
    columns: Array<TableColumn>;

    /**
     * Get all the columns configured in the database
     */
    abstract getColumns(): Promise<TableColumn[]>;

    /**
     * Get all the entities in the database
     */
    abstract getRows(): Promise<RowDataType[]>;

    /**
     * Initial behaviour of stateManager
     */
    abstract getInitialType(): InitialType;

    /**
     * Get all the formulas
     */
    abstract getFormulas(): Promise<Record<string, unknown>>;

    /**
     * Abstract 
     * @param leaf 
     * @param plugin 
     * @param file 
     */
    constructor(leaf: WorkspaceLeaf, plugin: DBFolderPlugin, file?: TFile) {
        super(leaf);
        this.plugin = plugin;
        this.emitter = createEmitter();
        if (file) {
            this.file = file;
            this.plugin.removeView(this);
            this.plugin.addView(this);
        } else {
            this.register(
                this.containerEl.onWindowMigrated(() => {
                    this.plugin.removeView(this);
                    this.plugin.addView(this);
                })
            );
        }
    }

    /**
     * Asign an implementation for interact with disk data
     * @param keyImpl 
     */
    setDataApi(key?: string): void {
        if (!key || key === "default") {
            this.dataApi = new DefaultDataImpl(this);
        }
    }

    async build(): Promise<void> {
        await this.initDatabase();
    }

    private async initDatabase(): Promise<void> {
        try {
            LOGGER.info(`=>initDatabase ${this.file.path}`);
            // Load the database file
            this.diskConfig = await new DatabaseInfo(this.file, this.plugin.settings.local_settings).build();
            this.setDataApi(this.diskConfig.yaml.config.implementation);

            let yamlColumns: Record<string, DatabaseColumn> =
                this.diskConfig.yaml.columns;
            // Complete the columns with the metadata columns
            yamlColumns = await obtainMetadataColumns(
                yamlColumns,
                this.diskConfig.yaml.config
            );

            this.columns = await this.getColumns();
            this.initial = this.getInitialType();
            this.formulas = await this.getFormulas();

            // Define table properties
            this.shadowColumns = this.columns.filter((col) => col.skipPersist);
            const tableProps: TableDataType = {
                skipReset: false,
                view: this,
                stateManager: this.plugin.getStateManager(this.file),
            };
            // Render database
            const table = createDatabase(tableProps);
            this.rootContainer.render(table);
            this.diskConfig.saveOnDisk();
            LOGGER.info(`<=initDatabase ${this.file.path}`);
        } catch (e: unknown) {
            LOGGER.error(`initDatabase ${this.file.path}`, e);
            if (e instanceof DbFolderException) {
                e.render(this.rootContainer);
            } else {
                throw e;
            }
        }
    }

    /**
     * Called when the view is unmounted
     */
    destroy() {
        if (this.file) {
            // Remove draggables from render, as the DOM has already detached
            this.getStateManager().unregisterView(this);
            this.plugin.removeView(this);
            this.tableContainer.remove();
            this.detachViewComponents();
            LOGGER.info(`Closed view ${this.file.path}}`);
        }
    }

    private initActions(): void {
        // Settings action
        this.addAction(
            "gear",
            `${t("menu_pane_open_db_settings_action")}`,
            this.settingsAction.bind(this)
        );
        // Open as markdown action
        this.addAction(
            "document",
            `${t("menu_pane_open_as_md_action")}`,
            this.markdownAction.bind(this)
        );
    }

    initRootContainer(file: TFile) {
        this.tableContainer = this.contentEl.createDiv(
            Platform.isDesktop ? c("container") : c("container-mobile")
        );
        this.tableContainer.setAttribute("id", file.path);
        this.rootContainer = createRoot(this.tableContainer);
        return this;
    }

    /**
     * Reload the content of the view
     */
    async reloadDatabase() {
        this.rootContainer.unmount();
        this.rootContainer = createRoot(this.tableContainer);
        this.detachViewComponents();
        await this.build();
    }

    /**
     * Remove all action buttons from the view
     */
    private detachViewComponents(): void {
        Object.values(this.actionButtons).forEach((button) => {
            button.detach();
        });
        this.actionButtons = {};

        if (this.plugin.statusBarItem) {
            this.plugin.statusBarItem.detach();
            this.plugin.statusBarItem = null;
        }
        this.emitter.removeAllListeners();
    }

    /****************************************************************
     *                     Reactive Actions
     ****************************************************************/

    /**
     * Triggered when the user clicks on the associated pane menu item
     * @param menu 
     * @param source 
     * @param callSuper 
     * @returns 
     */
    onPaneMenu(menu: Menu, source: string, callSuper: boolean = true): void {
        if (source !== "more-options") {
            super.onPaneMenu(menu, source);
            return;
        }
        // Add a menu item to force the database to markdown view
        menu
            .addItem((item) => {
                item
                    .setTitle(t("menu_pane_open_as_md_action"))
                    .setIcon("document")
                    .onClick(this.markdownAction.bind(this));
            })
            .addItem((item) => {
                item
                    .setTitle(t("menu_pane_open_db_settings_action"))
                    .setIcon("gear")
                    .onClick(this.settingsAction.bind(this));
            })
            .addSeparator();

        if (callSuper) {
            super.onPaneMenu(menu, source);
        }
    }

    /**
     * Triggered when the associated file is loaded
     * @param file 
     * @returns 
     */
    async onLoadFile(file: TFile) {
        try {
            this.initRootContainer(file);
            return await super.onLoadFile(file);
        } catch (e) {
            const stateManager = this.plugin.stateManagers.get(this.file);
            throw e;
        }
    }

    /**
     * Triggered when the associated file is unloaded
     * @param file 
     * @returns 
     */
    async onUnloadFile(file: TFile) {
        this.destroy();
        return await super.onUnloadFile(file);
    }

    /**
     * Triggered when the associated view is closed
     */
    async onClose() {
        this.destroy();
    }

    /**
     * Triggered when the associated view is loaded
     */
    onload(): void {
        super.onload();
        this.initActions();
    }

    /**
     * Called after unloading a file
     */
    clear(): void { }

    /****************************************************************
     *                          Getters
     ****************************************************************/

    /**
     * Obtain the window associated with the view
     * @returns 
     */
    getWindow() {
        return getParentWindow(this.containerEl) as Window & typeof globalThis;
    }

    /**
     * Obtain the state manager associated with the plugin
     * @returns 
     */
    getStateManager(): StateManager {
        return this.plugin.getStateManager(this.file);
    }

    /**
     * Define the icon associated with the view
     * @returns 
     */
    getIcon() {
        return DB_ICONS.NAME;
    }

    /**
     * Define the type key associated with the view
     * @returns 
     */
    getViewType(): string {
        return DatabaseCore.FRONTMATTER_KEY;
    }

    /**
     * id of the view
     */
    get id(): string {
        // TODO define id on workfleaf
        return `${(this.leaf as any).id}:::${this.file?.path}`;
    }

    /****************************************************************
     *                     KEYBOARD SHORTCUTS
     ****************************************************************/

    /**
     * Shortcut to go to the next page
     */
    goNextPage() {
        this.emitter.emit(EMITTERS_GROUPS.SHORTCUT, EMITTERS_SHORTCUT.GO_NEXT_PAGE);
    }

    goPreviousPage() {
        this.emitter.emit(
            EMITTERS_GROUPS.SHORTCUT,
            EMITTERS_SHORTCUT.GO_PREVIOUS_PAGE
        );
    }

    addNewRow() {
        this.emitter.emit(EMITTERS_GROUPS.SHORTCUT, EMITTERS_SHORTCUT.ADD_NEW_ROW);
    }

    toggleFilters() {
        this.emitter.emit(
            EMITTERS_GROUPS.SHORTCUT,
            EMITTERS_SHORTCUT.TOGGLE_FILTERS
        );
    }

    openFilters() {
        this.emitter.emit(EMITTERS_GROUPS.SHORTCUT, EMITTERS_SHORTCUT.OPEN_FILTERS);
    }

    /**
     * Unparse the database file, and return the resulting text.
     * @returns
     */
    getViewData(): string {
        return this.data;
    }

    setViewData(data: string): void {
        if (!isDatabaseNote(data)) {
            this.plugin.databaseFileModes[(this.leaf as any).id || this.file.path] =
                InputType.MARKDOWN;
            this.plugin.removeView(this);
            this.plugin.setMarkdownView(this.leaf, false);

            return;
        }

        this.plugin.addView(this);
    }

    get isPrimary(): boolean {
        return this.plugin.getStateManager(this.file)?.getAView() === this;
    }

    /****************************************************************
     *                     EVENT HANDLERS
     ****************************************************************/

    /**
     * Dataview API router triggered by any file change
     * @param op
     * @param file
     * @param oldPath
     */
    handleExternalMetadataChange(
        op: string,
        file: TFile,
        isActive: boolean,
        oldPath?: string
    ) {
        this.emitter.emit(EMITTERS_GROUPS.UPDATER, {
            op,
            file,
            isActive,
            oldPath,
        } as UpdaterData);
    }

    handleUpdateStatusBar() {
        this.emitter.emit(EMITTERS_GROUPS.BAR_STATUS, EMITTERS_BAR_STATUS.UPDATE);
    }

    /****************************************************************
    *                         BAR ACTIONS
    ****************************************************************/

    /**
     *
     * @param evt
     */
    settingsAction(evt?: MouseEvent): void {
        new SettingsModal(
            this,
            {
                onSettingsChange: (settings) => {
                    /**
                     * Settings are saved into the database file, so we don't need to do anything here.
                     */
                },
            },
            this.plugin.settings
        ).open();
    }

    markdownAction(evt: MouseEvent): void {
        this.plugin.databaseFileModes[(this.leaf as any).id || this.file.path] =
            InputType.MARKDOWN;
        this.plugin.setMarkdownView(this.leaf);
    }
}