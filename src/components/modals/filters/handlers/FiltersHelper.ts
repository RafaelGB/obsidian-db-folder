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
    TOGGLE_DISABLED = "TOGGLE_DISABLED"
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
        switch (key) {
            case ModifyFilterOptionsEnum.CONDITION:
                (filterGroups[recursiveIndex[level]] as FilterGroupCondition)
                    .condition = value;
                break;
            case ModifyFilterOptionsEnum.TOGGLE_DISABLED:
                (filterGroups[recursiveIndex[level]] as FilterGroupCondition)
                    .disabled = !((filterGroups[recursiveIndex[level]] as FilterGroupCondition)
                        .disabled);
                break;
            case ModifyFilterOptionsEnum.ADD:
                (filterGroups[recursiveIndex[level]] as FilterGroupCondition)
                    .filters.push({
                        field: possibleColumns[0],
                        operator: OperatorFilter.CONTAINS[0],
                        value: "",
                    });
                break;
            case ModifyFilterOptionsEnum.ADD_GROUP:
                (filterGroups[recursiveIndex[level]] as FilterGroupCondition)
                    .filters.push({
                        condition: ConditionFiltersOptions.OR,
                        disabled: false,
                        filters: [
                            {
                                field: possibleColumns[0],
                                operator: OperatorFilter.CONTAINS[0],
                                value: "",
                            },
                        ],
                    });
                break;
            case ModifyFilterOptionsEnum.OPERATOR:
                (filterGroups[recursiveIndex[level]] as AtomicFilter).operator = value;
                break;
            case ModifyFilterOptionsEnum.FIELD:
                (filterGroups[recursiveIndex[level]] as AtomicFilter).field = value;
                break;
            case ModifyFilterOptionsEnum.VALUE:
                (filterGroups[recursiveIndex[level]] as AtomicFilter).value = value;
                break;
            case ModifyFilterOptionsEnum.DELETE:
                filterGroups.splice(recursiveIndex[currentLvl], 1);
            default:
            // Do nothing
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