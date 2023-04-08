import { Literal } from "obsidian-dataview";
import { AtomicFilter, FilterGroup, FilterGroupCondition } from "../model/FiltersModel";
import { LocalSettings } from "cdm/SettingsModel";
import { ParseService } from "services/ParseService";
import { ConditionFiltersOptions, InputType, OperatorFilter, getOperatorFilterValue } from "helpers/Constants";

export function validateFilter(p: Record<string, Literal>, filter: FilterGroup, ddbbConfig: LocalSettings): boolean {
    if ((filter as FilterGroupCondition).condition) {
        return validateGroupCondition(p, filter as FilterGroupCondition, ddbbConfig);
    }
    return validateAtomicFilter(p, filter as AtomicFilter, ddbbConfig);
}

function validateAtomicFilter(p: Record<string, Literal>, filter: AtomicFilter, ddbbConfig: LocalSettings): boolean {
    const { field, operator, value, type } = filter;
    const literalToCheck: Literal = field.split('.').reduce((acc, cur) => {
        return acc[cur];
    }, p);

    const filterableValue = ParseService.parseLiteral(literalToCheck, InputType.MARKDOWN, ddbbConfig);
    // Atomic filter

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
        case OperatorFilter.NOT_CONTAINS[1]:
            if (filterableValue.toString().includes(value)) return false;
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

function validateGroupCondition(p: Record<string, Literal>, filter: FilterGroupCondition, ddbbConfig: LocalSettings): boolean {
    if (filter.disabled) {
        return true;
    }
    let groupResult = true;
    switch (filter.condition) {
        case ConditionFiltersOptions.AND:
            // If some filter is false, the group is false
            groupResult = !filter.filters.some((f) => {
                return !validateFilter(p, f, ddbbConfig);
            });
            break;
        case ConditionFiltersOptions.OR:
            // If some filter is true, the group is true
            groupResult = filter.filters.some((f) => {
                return validateFilter(p, f, ddbbConfig);
            });
            break;
        default:
        // Do nothing
    }
    return groupResult;
}