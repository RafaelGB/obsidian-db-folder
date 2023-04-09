import { Literal } from "obsidian-dataview";
import { DateTime } from "luxon";
import { AtomicFilter, FilterGroup, FilterGroupCondition } from "../model/FiltersModel";
import { LocalSettings } from "cdm/SettingsModel";
import { ParseService } from "services/ParseService";
import { ConditionFiltersOptions, InputType, OperatorFilter, getOperatorFilterValue } from "helpers/Constants";
import FilterValuesMapper from "../mappers/FilterValuesMapper";
import { LOGGER } from "services/Logger";

export function tableFilter(dbFilters: FilterGroup[], p: Record<string, Literal>, ddbbConfig: LocalSettings): boolean {
    if (!dbFilters || dbFilters.length === 0) return true;
    return !dbFilters.some((filter) => {
        return !new ValidateFilter(ddbbConfig).check(p, filter);
    });
}

class ValidateFilter {
    constructor(private ddbbConfig: LocalSettings) { }

    /**
     * Given a filter group, it will check if the entry matches the filter group condition (AND/OR) and the filters inside the group
     * 
     * @param entry 
     * @param filter 
     * @returns 
     */
    public check(entry: Record<string, Literal>, filter: FilterGroup): boolean {
        if ((filter as FilterGroupCondition).condition) {
            return this.validateGroupCondition(entry, filter as FilterGroupCondition);
        }
        return this.validateAtomicFilter(entry, filter as AtomicFilter);
    }

    private validateGroupCondition(p: Record<string, Literal>, filter: FilterGroupCondition): boolean {
        if (filter.disabled) {
            return true;
        }
        let groupResult = true;
        switch (filter.condition) {
            case ConditionFiltersOptions.AND:
                // If some filter is false, the group is false
                groupResult = !filter.filters.some((f) => {
                    return !this.check(p, f);
                });
                break;
            case ConditionFiltersOptions.OR:
                // If some filter is true, the group is true
                groupResult = filter.filters.some((f) => {
                    return this.check(p, f);
                });
                break;
            default:
            // Do nothing
        }
        return groupResult;
    }

    private validateAtomicFilter(p: Record<string, Literal>, filter: AtomicFilter): boolean {
        const { field, operator, value, type } = filter;
        const literalToCheck: Literal = field.split('.').reduce((acc, cur) => {
            return acc[cur];
        }, p);
        const operatorFilter = getOperatorFilterValue(operator);

        if (OperatorFilter.IS_EMPTY[1] === operatorFilter) {
            return (literalToCheck === null || literalToCheck === undefined || literalToCheck === '');
        }

        if (OperatorFilter.IS_NOT_EMPTY[1] === operatorFilter) {
            return (literalToCheck !== null && literalToCheck !== undefined && literalToCheck !== '');
        }
        console.log('literalToCheck', literalToCheck);
        switch (type) {
            case InputType.CALENDAR:
            case InputType.CALENDAR_TIME:
                return this.calendarAtomicFilter(literalToCheck, operatorFilter, value);
            default:
                return this.mdAtomicFilter(literalToCheck, operatorFilter, value);
        }
    }

    private calendarAtomicFilter(literalToCheck: Literal, operator: string, value: string): boolean {
        if (!DateTime.isDateTime(literalToCheck)) {
            return false;
        }
        const mappedValue = FilterValuesMapper.toCalendarValue(value);
        const diffMinutes = literalToCheck.diff(mappedValue, 'minute').minutes;
        switch (operator) {
            case OperatorFilter.EQUAL[1]:
                return diffMinutes === 0;
            case OperatorFilter.NOT_EQUAL[1]:
                return diffMinutes !== 0;
            case OperatorFilter.GREATER_THAN[1]:
                return diffMinutes > 0;
            case OperatorFilter.LESS_THAN[1]:
                return diffMinutes < 0;
            case OperatorFilter.GREATER_THAN_OR_EQUAL[1]:
                return diffMinutes >= 0;
            case OperatorFilter.LESS_THAN_OR_EQUAL[1]:
                return diffMinutes <= 0;
            default:
                LOGGER.error(`Operator ${operator} not supported for calendarAtomicFilter`);
                return false;
        }
    }

    private mdAtomicFilter(literalToCheck: Literal, operator: string, value: string): boolean {
        const filterableValue = ParseService.parseLiteral(literalToCheck, InputType.MARKDOWN, this.ddbbConfig);
        // Atomic filter

        switch (operator) {
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
}