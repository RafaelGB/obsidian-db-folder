import { AtomicFilter, FilterGroup, FilterGroupCondition } from "cdm/SettingsModel";
import { ConditionFiltersOptions, InputType, OperatorFilter } from "helpers/Constants";
import { ColumnFilterOption } from "../model/FiltersModel";

export enum ModifyFilterOptionsEnum {
    CONDITION = "CONDITION",
    ADD = "ADD",
    ADD_GROUP = "ADD_GROUP",
    OPERATOR = "OPERATOR",
    FIELD = "FIELD",
    VALUE = "VALUE",
    DELETE = "DELETE",
    TOGGLE_DISABLED = "TOGGLE_DISABLED",
    LABEL = "LABEL",
    COLOR = "COLOR"
}

const modifyRecursiveFilterGroups = (
    possibleColumns: ColumnFilterOption[],
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
                        field: possibleColumns[0].key,
                        operator: OperatorFilter.CONTAINS[0],
                        value: "",
                        type: possibleColumns[0].type,
                    });
                break;
            case ModifyFilterOptionsEnum.ADD_GROUP:
                (filterGroups[recursiveIndex[level]] as FilterGroupCondition)
                    .filters.push({
                        condition: ConditionFiltersOptions.OR,
                        disabled: false,
                        filters: [
                            {
                                field: possibleColumns[0].key,
                                operator: OperatorFilter.CONTAINS[0],
                                value: "",
                                type: possibleColumns[0].type,
                            },
                        ],
                    });
                break;
            case ModifyFilterOptionsEnum.LABEL:
                (filterGroups[recursiveIndex[level]] as FilterGroupCondition).label = value;
                break;
            case ModifyFilterOptionsEnum.COLOR:
                (filterGroups[recursiveIndex[level]] as FilterGroupCondition).color = value;
                break;
            case ModifyFilterOptionsEnum.OPERATOR:
                (filterGroups[recursiveIndex[level]] as AtomicFilter).operator = value;
                break;
            case ModifyFilterOptionsEnum.FIELD:
                (filterGroups[recursiveIndex[level]] as AtomicFilter).field = value;
                const potentialTypedField = possibleColumns.find(
                    (column) => column.key === value
                );
                (filterGroups[recursiveIndex[level]] as AtomicFilter).type = potentialTypedField ? potentialTypedField.type : InputType.TEXT;
                break;
            case ModifyFilterOptionsEnum.VALUE:
                (filterGroups[recursiveIndex[level]] as AtomicFilter).value = value;
                break;
            case ModifyFilterOptionsEnum.DELETE:
                filterGroups.splice(recursiveIndex[currentLvl], 1);
                break;
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