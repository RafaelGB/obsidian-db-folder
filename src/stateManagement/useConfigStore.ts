import { FilterSettings, LocalSettings } from "cdm/SettingsModel";
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
            actions: {
                alterFilters: (partialFilters: Partial<FilterSettings>) =>
                    set((state) => {
                        view.diskConfig.updateFilters(partialFilters);
                        return ({ filters: { ...state.filters, ...partialFilters } });
                    }),
                alterConfig: (alteredConfig: Partial<LocalSettings>) =>
                    set((state) => {
                        view.diskConfig.updateConfig(alteredConfig);
                        return ({ ddbbConfig: { ...state.ddbbConfig, ...alteredConfig } });
                    }),
            }
        })
    );
}
export default useConfigStore;