import { App, Modal, PluginSettingTab } from "obsidian";
import { add_setting_header} from 'settings/SettingsComponents';
import DBFolderPlugin from 'main';
import { DatabaseView } from "DatabaseView";
import { LOGGER } from "services/Logger";
import { developer_settings_section } from "settings/DeveloperSection";

interface GlobalSettings {
  enable_debug_mode: boolean;
  logger_level_info: string;
}

export interface LocalSettings {
  enable_show_state: boolean;
}
export interface DatabaseSettings {
  global_settings: GlobalSettings;
  local_settings: LocalSettings;
}

export const DEFAULT_SETTINGS: DatabaseSettings = {
  global_settings:{
    enable_debug_mode: false,
    logger_level_info: 'error'
  },
  local_settings:{
    enable_show_state: false
  }
};

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
    constructUI(containerEl: HTMLElement, heading: string, local: boolean,view?: DatabaseView) {
        /** Common modal headings */
        containerEl.empty();
        containerEl.addClass('database-settings-modal');
        add_setting_header(containerEl,heading,'h2');
        const settingsBody:HTMLDivElement = containerEl.createDiv('database-settings-body');
        this.constructSettingBody(settingsBody, local, view);
    }

    constructSettingBody(containerEl: HTMLElement, local: boolean, view?: DatabaseView) {
      containerEl.empty();
      /** Developer section */
      developer_settings_section(this, containerEl, local, view);
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
      super(view.app);
  
      this.view = view;
      this.settingsManager = new SettingsManager(view.plugin, config, settings);
    }
  
    onOpen() {
      const { contentEl, modalEl } = this;
  
      modalEl.addClass('database-settings-modal');
  
      this.settingsManager.constructUI(contentEl, this.view.file.basename, true, this.view);
    }
  
    onClose() {
      const { contentEl } = this;
  
      this.settingsManager.cleanUp();
      contentEl.empty();
    }
  }
  
export class DBFolderSettingTab extends PluginSettingTab {
    plugin: DBFolderPlugin;
    settingsManager: SettingsManager;
	constructor(plugin: DBFolderPlugin, config: SettingsManagerConfig) {
        super(plugin.app, plugin);
        this.plugin = plugin;
        this.settingsManager = new SettingsManager(plugin, config, plugin.settings);
    }

	display(): void {
        const { containerEl } = this;    
        this.settingsManager.constructUI(containerEl,'Database Folder Plugin', false);
	}
}

export function loadServicesThatRequireSettings(settings: DatabaseSettings) {
  /** Init logger */
    LOGGER.setDebugMode(settings.global_settings.enable_debug_mode);
    LOGGER.setLevelInfo(settings.global_settings.logger_level_info);
}