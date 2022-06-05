import { DatabaseColumn } from "cdm/DatabaseModel";
import { InitialState, TableDataType } from "cdm/FolderModel";
import {
  obtainColumnsFromFolder,
  obtainMetadataColumns,
} from "components/Columns";
import { createDatabase } from "components/index/Database";
import { DbFolderError } from "errors/AbstractError";
import { DatabaseCore, DataTypes, StyleClasses } from "helpers/Constants";
import obtainInitialState from "helpers/InitialState";
import { adapterTFilesToRows, isDatabaseNote } from "helpers/VaultManagement";
import DBFolderPlugin from "main";

import {
  HoverParent,
  HoverPopover,
  TextFileView,
  WorkspaceLeaf,
  TFile,
  Menu,
} from "obsidian";
import * as React from "react";
import ReactDOM from "react-dom";
import DatabaseInfo from "services/DatabaseInfo";
import { LOGGER } from "services/Logger";
import { SettingsModal } from "Settings";
import StateManager from "StateManager";
export const databaseIcon = "blocks";

export class DatabaseView extends TextFileView implements HoverParent {
  plugin: DBFolderPlugin;
  hoverPopover: HoverPopover | null;
  tableContainer: HTMLDivElement | null = null;
  diskConfig: DatabaseInfo;

  constructor(leaf: WorkspaceLeaf, plugin: DBFolderPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  /**
   * Unparse the database file, and return the resulting text.
   * @returns
   */
  getViewData(): string {
    return this.data;
  }

  setViewData(data: string, clear: boolean): void {
    if (!isDatabaseNote(data)) {
      this.plugin.databaseFileModes[(this.leaf as any).id || this.file.path] =
        DataTypes.MARKDOWN;
      this.plugin.removeView(this);
      this.plugin.setMarkdownView(this.leaf, false);

      return;
    }

    this.plugin.addView(this, data, !clear && this.isPrimary);
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

  onMoreOptionsMenu(menu: Menu) {
    // Add a menu item to force the database to markdown view
    menu
      .addItem((item) => {
        item
          .setTitle("Open as markdown")
          .setIcon("document")
          .onClick(() => {
            this.plugin.databaseFileModes[
              (this.leaf as any).id || this.file.path
            ] = DataTypes.MARKDOWN;
            this.plugin.setMarkdownView(this.leaf);
          });
      })
      .addItem((item) => {
        item
          .setTitle("Open database settings")
          .setIcon("gear")
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

    super.onMoreOptionsMenu(menu);
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
      const columns = await obtainColumnsFromFolder(yamlColumns);
      const rows = await adapterTFilesToRows(
        this.file.parent.path,
        columns,
        this.diskConfig.yaml
      );
      const initialState: InitialState = obtainInitialState(columns, rows);

      // Define table properties
      const tableProps: TableDataType = {
        columns: columns,
        shadowColumns: columns.filter((col) => col.skipPersist),
        data: rows,
        skipReset: false,
        view: this,
        stateManager: this.plugin.getStateManager(this.file),
        initialState: initialState,
        cellSize: this.diskConfig.yaml.config.cell_size
      };

      // Render database
      const table = createDatabase(tableProps);
      ReactDOM.render(table, this.tableContainer);
      LOGGER.info(`<=initDatabase ${this.file.path}`);
    } catch (e: unknown) {
      LOGGER.error(`initDatabase ${this.file.path}`, e);
      if (e instanceof DbFolderError) {
        e.render(this.tableContainer);
      } else {
        throw e;
      }
    }
  }

  destroy() {
    LOGGER.info(`=>destroy ${this.file.path}`);
    // Remove draggables from render, as the DOM has already detached
    this.plugin.removeView(this);
    ReactDOM.unmountComponentAtNode(this.tableContainer);
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

  async onLoadFile(file: TFile) {
    try {
      this.tableContainer = this.contentEl.createDiv(
        StyleClasses.TABLE_CONTAINER
      );
      return await super.onLoadFile(file);
    } catch (e) {
      const stateManager = this.plugin.stateManagers.get(this.file);
      throw e;
    }
  }

  async reloadDatabase() {
    ReactDOM.unmountComponentAtNode(this.tableContainer);
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
