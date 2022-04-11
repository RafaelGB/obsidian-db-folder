import { App, Modal, PluginSettingTab } from "obsidian";
import { add_setting_header, add_toggle} from 'settings/SettingsComponents';
import DBFolderPlugin from 'main';
import { DatabaseView } from "DatabaseView";
import { LOGGER } from "services/Logger";
import { developer_settings_section } from "settings/DeveloperSection";


export interface DatabaseSettings {
    enable_debug_mode: boolean;
}

export const DEFAULT_SETTINGS: DatabaseSettings = {
    enable_debug_mode: false,
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
    constructUI(containerEl: HTMLElement, heading: string, local: boolean) {
        /** Common modal headings */
        containerEl.empty();
        containerEl.addClass('database-settings-modal');
        add_setting_header(containerEl,heading,'h2');
        /** Developer section */
        developer_settings_section(this, containerEl, local);
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
  
      this.settingsManager.constructUI(contentEl, this.view.file.basename, true);
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
        this.settingsManager.constructUI(containerEl,'Kanban Plugin', false);
	}
}

export function loadServicesThatRequireSettings(settings: DatabaseSettings) {
  /** Init logger */
    LOGGER.setDebugMode(settings.enable_debug_mode);
}