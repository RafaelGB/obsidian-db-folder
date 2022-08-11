import { LocalSettings } from "cdm/SettingsModel";
import { ConfigState } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import create from "zustand";

const useConfigStore = (view: DatabaseView) => {
    const { global_settings } = view.plugin.settings;
    const { config, filters } = view.diskConfig.yaml;
    return create<ConfigState>()(
        (set) => ({
            ddbbConfig: config,
            filters: filters,
            global: global_settings,
            alterConfig: (alteredConfig: Partial<LocalSettings>) =>
                set((state) => {
                    const newConfig = { ...state.ddbbConfig, ...alteredConfig };
                    view.diskConfig.updateConfig(config);

                    view.plugin.updateSettings({ local_settings: { ...state.ddbbConfig, ...alteredConfig } });

                    return ({ ddbbConfig: newConfig });
                })
        })
    );
}
export default useConfigStore;