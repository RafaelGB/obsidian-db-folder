import { DatabaseColumn } from "cdm/DatabaseModel";
import { TableDataType } from "cdm/FolderModel";
import {
  obtainColumnsFromFolder,
  obtainMetadataColumns,
} from "components/Columns";
import { createDatabase } from "components/index/Database";
import { DbFolderException } from "errors/AbstractException";
import { InputType } from "helpers/Constants";
import { createEmitter } from "helpers/Emitter";
import obtainInitialType from "helpers/InitialType";
import { c } from "helpers/StylesHelper";
import { adapterTFilesToRows, isDatabaseNote } from "helpers/VaultManagement";
import { getParentWindow } from "helpers/WindowElement";
import { t } from "lang/helpers";
import DBFolderPlugin from "main";

import { WorkspaceLeaf, TFile, Menu, Platform } from "obsidian";
import { createRoot } from "react-dom/client";
import { Db } from "services/CoreService";
import DatabaseInfo from "services/DatabaseInfo";
import { LOGGER } from "services/Logger";
import { SettingsModal } from "Settings";
import StateManager from "StateManager";
import { CustomView } from "./AbstractView";

export class DatabaseView extends CustomView {
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

      this.formulas = await Db.buildFns(this.diskConfig.yaml.config);
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

  postRenderActions(): void {}

  onload(): void {
    super.onload();
    this.initActions();
  }

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

  async onClose() {
    this.destroy();
  }

  async onUnloadFile(file: TFile) {
    this.destroy();
    return await super.onUnloadFile(file);
  }

  initRootContainer(file: TFile) {
    this.tableContainer = this.contentEl.createDiv(
      Platform.isDesktop ? c("container") : c("container-mobile")
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
    this.detachViewComponents();
    await this.initDatabase();
  }

  /**
   * Remove all action buttons from the view
   */
  detachViewComponents(): void {
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
