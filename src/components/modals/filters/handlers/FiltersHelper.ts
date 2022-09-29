import { AtomicFilter, FilterGroup, FilterGroupCondition } from "cdm/SettingsModel";
import { ConditionFiltersOptions, OperatorFilter } from "helpers/Constants";

const modifyRecursiveFilterGroups = (
    possibleColumns: string[],
    filterGroups: FilterGroup[],
    recursiveIndex: number[],
    level: number,
    key: string,
    value?: string,
    currentLvl = 0
) => {
    if (level === currentLvl) {
        // last level
        if (key === "condition") {
            (
                filterGroups[recursiveIndex[level]] as FilterGroupCondition
            ).condition = value;
        } else if (key === "add") {
            (
                filterGroups[recursiveIndex[level]] as FilterGroupCondition
            ).filters.push({
                field: possibleColumns[0],
                operator: OperatorFilter.CONTAINS[0],
                value: "",
            });
        } else if (key === "addGroup") {
            (
                filterGroups[recursiveIndex[level]] as FilterGroupCondition
            ).filters.push({
                condition: ConditionFiltersOptions.OR,
                filters: [
                    {
                        field: possibleColumns[0],
                        operator: OperatorFilter.CONTAINS[0],
                        value: "",
                    },
                ],
            });
        } else if (key === "operator") {
            (filterGroups[recursiveIndex[level]] as AtomicFilter).operator = value;
        } else if (key === "field") {
            (filterGroups[recursiveIndex[level]] as AtomicFilter).field = value;
        } else if (key === "value") {
            (filterGroups[recursiveIndex[level]] as AtomicFilter).value = value;
        } else if (key === "delete") {
            filterGroups.splice(recursiveIndex[currentLvl], 1);
        }
    } else {
        modifyRecursiveFilterGroups(
            possibleColumns,
            (filterGroups[recursiveIndex[currentLvl]] as FilterGroupCondition)
                .filters,
            recursiveIndex,
            level,
            key,
            value,
            currentLvl + 1
        );
    }
};
export default modifyRecursiveFilterGroups;