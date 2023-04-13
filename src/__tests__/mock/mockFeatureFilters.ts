import { FilterGroup } from "@features/filters/model/FiltersModel";
import { ConditionFiltersOptions } from "helpers/Constants";

export const generateFilterGroupArray = (): FilterGroup[] => {
    const filterGroup: FilterGroup = {
        condition: ConditionFiltersOptions.AND,
        filters: [],
        disabled: false,
    };
    const filterGroupArray: FilterGroup[] = [filterGroup];
    return filterGroupArray;
}