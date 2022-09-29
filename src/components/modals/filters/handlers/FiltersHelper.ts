import { AtomicFilter, FilterGroup, FilterGroupCondition } from "cdm/SettingsModel";
import { ConditionFiltersOptions, OperatorFilter } from "helpers/Constants";

export enum ModifyFilterOptionsEnum {
    CONDITION = "CONDITION",
    ADD = "ADD",
    ADD_GROUP = "ADD_GROUP",
    OPERATOR = "OPERATOR",
    FIELD = "FIELD",
    VALUE = "VALUE",
    DELETE = "DELETE",
}

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
        if (key === ModifyFilterOptionsEnum.CONDITION) {
            (
                filterGroups[recursiveIndex[level]] as FilterGroupCondition
            ).condition = value;
        } else if (key === ModifyFilterOptionsEnum.ADD) {
            (
                filterGroups[recursiveIndex[level]] as FilterGroupCondition
            ).filters.push({
                field: possibleColumns[0],
                operator: OperatorFilter.CONTAINS[0],
                value: "",
            });
        } else if (key === ModifyFilterOptionsEnum.ADD_GROUP) {
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
        } else if (key === ModifyFilterOptionsEnum.OPERATOR) {
            (filterGroups[recursiveIndex[level]] as AtomicFilter).operator = value;
        } else if (key === ModifyFilterOptionsEnum.FIELD) {
            (filterGroups[recursiveIndex[level]] as AtomicFilter).field = value;
        } else if (key === ModifyFilterOptionsEnum.VALUE) {
            (filterGroups[recursiveIndex[level]] as AtomicFilter).value = value;
        } else if (key === ModifyFilterOptionsEnum.DELETE) {
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