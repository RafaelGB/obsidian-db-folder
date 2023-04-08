import { Literal } from "obsidian-dataview";
import { FilterGroup } from "./model/FiltersModel";
import { LocalSettings } from "cdm/SettingsModel";
import { validateFilter } from "./cases/ValidateFilterCases";

export function tableFilter(dbFilters: FilterGroup[], p: Record<string, Literal>, ddbbConfig: LocalSettings): boolean {
    if (!dbFilters || dbFilters.length === 0) return true;
    return !dbFilters.some((filter) => {
        return !validateFilter(p, filter, ddbbConfig);
    });
}

export * from "./components/FiltersModal";