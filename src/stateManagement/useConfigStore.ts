import { FilterSettings, GlobalSettings, LocalSettings } from "cdm/SettingsModel";
import { ConfigState, EphimeralSettings } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import { EphimeralConfiguration } from "helpers/Constants";
import create from "zustand";

const useConfigStore = (view: DatabaseView) => {
    const { global_settings } = view.plugin.settings;
    const { config, filters } = view.diskConfig.yaml;
    return create<ConfigState>()(
        (set, get) => ({
            ddbbConfig: config,
            filters: filters,
            global: global_settings,
            ephimeral: constructEphimeralSettings(global_settings),
            actions: {
                alterFilters: async (partialFilters: Partial<FilterSettings>) => {
                    await view.diskConfig.updateFilters(partialFilters);
                    set((state) => {
                        return ({ filters: { ...state.filters, ...partialFilters } });
                    })
                },
                alterConfig: (alteredConfig: Partial<LocalSettings>) =>
                    set((state) => {
                        view.diskConfig.updateConfig(alteredConfig);
                        return ({ ddbbConfig: { ...state.ddbbConfig, ...alteredConfig } });
                    }),
                alterEphimeral: async (alteredEphimeral: Partial<EphimeralSettings>) => {
                    set((state) => {
                        return ({ ephimeral: { ...state.ephimeral, ...alteredEphimeral } });
                    })
                }
            },
            info: {
                getLocalSettings: () => get().ddbbConfig,
                getFilters: () => get().filters,
                getEphimeralSettings: () => get().ephimeral
            },
        })
    );
}
const constructEphimeralSettings = (global_settings: GlobalSettings
): EphimeralSettings => {
    return {
        ...EphimeralConfiguration,
        enable_navbar: global_settings.show_search_bar_by_default,
    }
}
export default useConfigStore;