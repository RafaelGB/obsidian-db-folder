import { App, Modal, PluginSettingTab } from "obsidian";
import { add_setting_header } from 'settings/SettingsComponents';
import DBFolderPlugin from 'main';
import { DatabaseView } from "DatabaseView";
import { LOGGER } from "services/Logger";
import columns_settings_section from "settings/ColumnsSection";
import { folder_settings_section } from "settings/FolderSection";
import developer_settings_section from "settings/DeveloperSection";
import { StyleClasses } from "helpers/Constants";
import { SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { media_settings_section } from "settings/MediaSection";
import { source_settings_section } from "settings/SourceSection";
import { DatabaseSettings } from "cdm/SettingsModel";
import editing_engine_settings_section from "settings/EditingEngineSection";
import rows_settings_section from "settings/RowsSection";
import csv_settings_section from "settings/CSVSection";
import automation_settings_section from "settings/AutomationSection";
import helpers_settings_section from "settings/HelpersSection";

export type SettingRetriever = <K extends keyof DatabaseSettings>(
  key: K,
  supplied?: DatabaseSettings
) => DatabaseSettings[K];

export interface SettingRetrievers {
  getGlobalSettings: () => DatabaseSettings;
  getGlobalSetting: SettingRetriever;
  getSetting: SettingRetriever;
}

export interface SettingsManagerConfig {
  onSettingsChange: (newSettings: DatabaseSettings) => void;
}

export class SettingsManager {
  app: App;
  plugin: DBFolderPlugin;
  config: SettingsManagerConfig;
  settings: DatabaseSettings;
  cleanupFns: Array<() => void> = [];
  applyDebounceTimer: number = 0;

  constructor(
    plugin: DBFolderPlugin,
    config: SettingsManagerConfig,
    settings: DatabaseSettings
  ) {
    this.app = plugin.app;
    this.plugin = plugin;
    this.config = config;
    this.settings = settings;
  }

  /**
   * Render settings window
   * @param containerEl 
   * @param heading 
   * @param local 
   * @param view optional. Used only for local settings
   */
  constructUI(containerEl: HTMLElement, heading: string, local: boolean, view?: DatabaseView) {
    /** Common modal headings */
    containerEl.addClass(StyleClasses.SETTINGS_MODAL);
    add_setting_header(containerEl, heading, 'h2');

    const settingBody = containerEl.createDiv();
    settingBody.addClass(StyleClasses.SETTINGS_MODAL_BODY);
    settingBody.setAttribute("id", StyleClasses.SETTINGS_MODAL_BODY);
    const settingHandlerResponse: SettingHandlerResponse = {
      settingsManager: this,
      containerEl: settingBody,
      local: local,
      errors: {}
    };
    if (view) {
      settingHandlerResponse.view = view;
      settingHandlerResponse.columns = view.columns;

    }
    this.constructSettingBody(settingHandlerResponse);
  }

  constructSettingBody(settingHandlerResponse: SettingHandlerResponse) {
    if (settingHandlerResponse.local) {
      /** Source section */
      source_settings_section(settingHandlerResponse);
    }
    /** Folder section */
    folder_settings_section(settingHandlerResponse);
    /** Columns section */
    columns_settings_section.run(settingHandlerResponse);
    /** Rows section */
    rows_settings_section.run(settingHandlerResponse);
    /** Editing engine section */
    editing_engine_settings_section.run(settingHandlerResponse);
    /** Automation section */
    automation_settings_section.run(settingHandlerResponse);
    if (!settingHandlerResponse.local) {
      /** Media section */
      media_settings_section(settingHandlerResponse);
      /** CSV section */
      csv_settings_section.run(settingHandlerResponse);
      /** Helpers/Commands section */
      helpers_settings_section.run(settingHandlerResponse);
      /** Developer section */
      developer_settings_section.run(settingHandlerResponse);
    }
  }

  reset(response: SettingHandlerResponse) {
    const settingsElement = activeDocument.getElementById(StyleClasses.SETTINGS_MODAL_BODY);
    // remove all sections
    settingsElement.empty();

    response.errors = {};
    response.containerEl = settingsElement;
    this.constructSettingBody(response);
  }

  cleanUp() {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
  }
}

export class SettingsModal extends Modal {
  view: DatabaseView;
  settingsManager: SettingsManager;

  constructor(
    view: DatabaseView,
    config: SettingsManagerConfig,
    settings: DatabaseSettings
  ) {
    super(app);

    this.view = view;
    this.settingsManager = new SettingsManager(view.plugin, config, settings);
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    contentEl.empty();
    modalEl.addClass(StyleClasses.SETTINGS_MODAL);
    this.settingsManager.constructUI(contentEl, this.view.file.basename, true, this.view);
  }

  onClose() {
    const { contentEl } = this;

    this.settingsManager.cleanUp();
    contentEl.empty();
    this.view.reloadDatabase();
  }
}

export class DBFolderSettingTab extends PluginSettingTab {
  plugin: DBFolderPlugin;
  settingsManager: SettingsManager;
  constructor(plugin: DBFolderPlugin, config: SettingsManagerConfig) {
    super(app, plugin);
    this.plugin = plugin;
    this.settingsManager = new SettingsManager(plugin, config, plugin.settings);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    this.settingsManager.constructUI(containerEl, 'Database Folder Plugin', false);
  }
}

export function loadServicesThatRequireSettings(settings: DatabaseSettings) {
  /** Init logger */
  LOGGER.setDebugMode(settings.global_settings.enable_debug_mode);
  LOGGER.setLevelInfo(settings.global_settings.logger_level_info);
}