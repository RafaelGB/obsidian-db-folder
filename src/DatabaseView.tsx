import { obtainFormulasFromFolder } from "automations/AutomationsHelper";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { ViewEvents } from "cdm/EmitterModel";
import {
  InitialType,
  RowDataType,
  TableColumn,
  TableDataType,
} from "cdm/FolderModel";
import {
  obtainColumnsFromFolder,
  obtainMetadataColumns,
} from "components/Columns";
import { createDatabase } from "components/index/Database";
import { DbFolderException } from "errors/AbstractException";
import {
  DatabaseCore,
  DB_ICONS,
  InputType,
  StyleClasses,
} from "helpers/Constants";
import { createEmitter, Emitter } from "helpers/Emitter";
import obtainInitialType from "helpers/InitialType";
import { adapterTFilesToRows, isDatabaseNote } from "helpers/VaultManagement";
import { getParentWindow } from "helpers/WindowElement";
import { t } from "lang/helpers";
import DBFolderPlugin from "main";

import {
  HoverParent,
  HoverPopover,
  TextFileView,
  WorkspaceLeaf,
  TFile,
  Menu,
} from "obsidian";
import { createRoot, Root } from "react-dom/client";
import DatabaseInfo from "services/DatabaseInfo";
import { LOGGER } from "services/Logger";
import { SettingsModal } from "Settings";
import StateManager from "StateManager";

export class DatabaseView extends TextFileView implements HoverParent {
  plugin: DBFolderPlugin;
  hoverPopover: HoverPopover | null;
  emitter: Emitter<ViewEvents>;
  tableContainer: HTMLDivElement | null = null;
  rootContainer: Root | null = null;
  diskConfig: DatabaseInfo;
  rows: Array<RowDataType>;
  columns: Array<TableColumn>;
  shadowColumns: Array<TableColumn>;
  initial: InitialType;
  formulas: Record<string, unknown>;

  constructor(leaf: WorkspaceLeaf, plugin: DBFolderPlugin, file?: TFile) {
    super(leaf);
    this.plugin = plugin;
    this.emitter = createEmitter();
    if (file) {
      this.file = file;
      this.plugin.removeView(this);
      this.plugin.addView(this, this.data);
    } else {
      this.register(
        this.containerEl.onWindowMigrated(() => {
          this.plugin.removeView(this);
          this.plugin.addView(this, this.data);
        })
      );
    }
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

    this.plugin.addView(this, data);
  }

  getViewType(): string {
    return DatabaseCore.FRONTMATTER_KEY;
  }

  getStateManager(): StateManager {
    return this.plugin.getStateManager(this.file);
  }
  get id(): string {
    // TODO define id on workfleaf
    return `${(this.leaf as any).id}:::${this.file?.path}`;
  }

  get isPrimary(): boolean {
    return this.plugin.getStateManager(this.file)?.getAView() === this;
  }

  getWindow() {
    return getParentWindow(this.containerEl) as Window & typeof globalThis;
  }

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
          .onClick(() => {
            this.plugin.databaseFileModes[
              (this.leaf as any).id || this.file.path
            ] = InputType.MARKDOWN;
            this.plugin.setMarkdownView(this.leaf);
          });
      })
      .addItem((item) => {
        item
          .setTitle(t("menu_pane_open_db_settings_action"))
          .setIcon(DB_ICONS.NAME)
          .onClick(() => {
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
          });
      })
      .addSeparator();

    if (callSuper) {
      super.onPaneMenu(menu, source);
    }
  }

  async initDatabase(): Promise<void> {
    try {
      LOGGER.info(`=>initDatabase ${this.file.path}`);
      // Load the database file
      this.diskConfig = new DatabaseInfo(this.file);
      await this.diskConfig.initDatabaseconfigYaml(
        this.plugin.settings.local_settings
      );
      let yamlColumns: Record<string, DatabaseColumn> =
        this.diskConfig.yaml.columns;
      // Complete the columns with the metadata columns
      yamlColumns = await obtainMetadataColumns(
        yamlColumns,
        this.diskConfig.yaml.config
      );
      // Obtain base information about columns
      this.columns = await obtainColumnsFromFolder(yamlColumns);
      this.rows = await adapterTFilesToRows(
        this.file,
        this.columns,
        this.diskConfig.yaml.config,
        this.diskConfig.yaml.filters
      );

      this.initial = obtainInitialType(this.columns);

      this.formulas = await obtainFormulasFromFolder(
        this.diskConfig.yaml.config
      );
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
        e.render(this.tableContainer);
      } else {
        throw e;
      }
    }
  }

  destroy() {
    LOGGER.info(`=>destroy ${this.file.path}`);
    // Remove draggables from render, as the DOM has already detached
    this.getStateManager().unregisterView(this);
    this.plugin.removeView(this);
    this.tableContainer.remove();
    LOGGER.info(`<=destroy ${this.file.path}`);
  }

  async onClose() {
    this.destroy();
  }

  async onUnloadFile(file: TFile) {
    this.destroy();
    return await super.onUnloadFile(file);
  }

  initRootContainer(file: TFile) {
    this.tableContainer = this.contentEl.createDiv(
      StyleClasses.TABLE_CONTAINER
    );
    this.tableContainer.setAttribute("id", file.path);
    this.rootContainer = createRoot(this.tableContainer);
  }

  async onLoadFile(file: TFile) {
    try {
      this.initRootContainer(file);
      return await super.onLoadFile(file);
    } catch (e) {
      const stateManager = this.plugin.stateManagers.get(this.file);
      throw e;
    }
  }

  async reloadDatabase() {
    this.rootContainer.unmount();
    this.rootContainer = createRoot(this.tableContainer);
    this.initDatabase();
  }

  clear(): void {
    /*
        Obsidian *only* calls this after unloading a file, before loading the next.
        Specifically, from onUnloadFile, which calls save(true), and then optionally
        calls clear, if and only if this.file is still non-empty.  That means that
        in this function, this.file is still the *old* file, so we should not do
        anything here that might try to use the file (including its path), so we
        should avoid doing anything that refreshes the display.  (Since that could
        use the file, and would also flash an empty pane during navigation, depending
        on how long the next file load takes.)
        Given all that, it makes more sense to clean up our state from onLoadFile, as
        following a clear there are only two possible states: a successful onLoadFile
        updates our full state via setViewData(), or else it aborts with an error
        first.  So as long as setViewData() and the error handler for onLoadFile()
        fully reset the state (to a valid load state or a valid error state),
        there's nothing to do in this method.  (We can't omit it, since it's
        abstract.)
        */
  }
}
