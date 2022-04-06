import { App, PluginSettingTab } from "obsidian";
import { add_toggle} from 'components/SettingsComponents';
import DBFolderPlugin from 'main';


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

export class DBFolderSettingTab extends PluginSettingTab {

	constructor(public app: App, private plugin: DBFolderPlugin) {
        super(app, plugin);
    }

	display(): void {
        // Empty the container
		this.containerEl.empty();
		this.add_setting_header("DBFolder Settings");
        this.developer_settings();
	}
    /**
     * Add a header to the settings tab
     */
    add_setting_header(tittle: string,level: keyof HTMLElementTagNameMap = 'h2'): void{
        let {containerEl} = this;
        containerEl.createEl(level, {text: tittle});
    }

    /**
     * developer settings
     */
    developer_settings(): void {
        // title of the section
        this.add_setting_header("Developer section",'h3');
        // Enable or disable debug mode
        let debug_togle_promise = async (value: boolean): Promise<void> => {
            await this.plugin.updateSettings({ enable_debug_mode: value });
        }
        add_toggle(
            this.containerEl,
            "Enable debug mode", 
            "This will log all the errors and warnings in the console",
            this.plugin.settings.enable_debug_mode, 
            debug_togle_promise);
    }
}