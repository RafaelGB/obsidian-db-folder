import { LocalSettings } from "cdm/SettingsModel";
import { ConfigState } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import create from "zustand";

const useConfigStore = (view: DatabaseView) => {
    const { global_settings, local_settings } = view.plugin.settings;
    return create<ConfigState>()(
        (set) => ({
            ddbbConfig: local_settings,
            global: global_settings,
            alterConfig: (config: Partial<LocalSettings>) => {
                view.diskConfig.updateConfiglab(config);
                view.plugin.updateSettings({ local_settings: { ...local_settings, ...config } });
                set({ ddbbConfig: { ...local_settings, ...config } });
            }
        })
    );
}
export default useConfigStore;