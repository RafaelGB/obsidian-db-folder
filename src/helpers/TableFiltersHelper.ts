import { AtomicFilter, FilterGroup, FilterGroupCondition, LocalSettings } from "cdm/SettingsModel";
import { Literal } from "obsidian-dataview";
import { ConditionFiltersOptions, getOperatorFilterValue, InputType, OperatorFilter } from "helpers/Constants";
import { DataviewService } from "services/DataviewService";

export default function tableFilter(dbFilters: FilterGroup[], p: Record<string, Literal>, ddbbConfig: LocalSettings): boolean {
    if (!dbFilters || dbFilters.length === 0) return true;
    return !dbFilters.some((filter) => {
        return !validateFilter(p, filter, ddbbConfig);
    });
}

function validateFilter(p: Record<string, Literal>, filter: FilterGroup, ddbbConfig: LocalSettings): boolean {
    if ((filter as FilterGroupCondition).condition) {
        if ((filter as FilterGroupCondition).disabled) {
            return true;
        }
        let groupResult = true;
        switch ((filter as FilterGroupCondition).condition) {
            case ConditionFiltersOptions.AND:
                // If some filter is false, the group is false
                groupResult = !(filter as FilterGroupCondition).filters.some((f) => {
                    return !validateFilter(p, f, ddbbConfig);
                });
                break;
            case ConditionFiltersOptions.OR:
                // If some filter is true, the group is true
                groupResult = (filter as FilterGroupCondition).filters.some((f) => {
                    return validateFilter(p, f, ddbbConfig);
                });
                break;
            default:
            // Do nothing
        }
        return groupResult;
    }
    const filterableValue = DataviewService.parseLiteral(p[(filter as AtomicFilter).field], InputType.MARKDOWN, ddbbConfig);
    // Atomic filter
    const operator = (filter as AtomicFilter).operator;
    const value = (filter as AtomicFilter).value;
    switch (getOperatorFilterValue(operator)) {
        case OperatorFilter.IS_EMPTY[1]:
            if (filterableValue !== '') {
                return false;
            }
            break;
        case OperatorFilter.IS_NOT_EMPTY[1]:
            if (filterableValue === '') {
                return false;
            }
            break;
        case OperatorFilter.EQUAL[1]:
            if (filterableValue !== value) return false;
            break;
        case OperatorFilter.NOT_EQUAL[1]:
            if (filterableValue === value) return false;
            break;
        case OperatorFilter.GREATER_THAN[1]:
            if (filterableValue <= value) return false;
            break;
        case OperatorFilter.LESS_THAN[1]:
            if (filterableValue >= value) return false;
            break;
        case OperatorFilter.GREATER_THAN_OR_EQUAL[1]:
            if (filterableValue < value) return false;
            break;
        case OperatorFilter.LESS_THAN_OR_EQUAL[1]:
            if (filterableValue > value) return false;
            break;
        case OperatorFilter.CONTAINS[1]:
            if (!filterableValue.toString().includes(value)) return false;
            break;
        case OperatorFilter.STARTS_WITH[1]:
            if (!filterableValue.toString().startsWith(value)) return false;
            break;
        case OperatorFilter.ENDS_WITH[1]:
            if (!filterableValue.toString().endsWith(value)) return false;
            break;
        default:
            throw new Error(`Unknown operator ${operator}`);
    }
    return true;
}