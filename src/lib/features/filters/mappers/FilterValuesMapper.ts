import { DateTime } from "luxon";
import { FilterCalendarResponse } from "../model/FiltersModel";
export const valueToCalendarConverter = new Map<string, FilterCalendarResponse>([
    ["today", { unit: "day", date: DateTime.local().startOf("day") }],
    ["yesterday", { unit: "day", date: DateTime.local().minus({ days: 1 }).startOf("day") }],
    ["tomorrow", { unit: "day", date: DateTime.local().plus({ days: 1 }).startOf("day") }],
    ["thisweek", { unit: "week", date: DateTime.local().startOf("week") }],
    ["lastweek", { unit: "week", date: DateTime.local().minus({ weeks: 1 }).startOf("week") }],
    ["nextweek", { unit: "week", date: DateTime.local().plus({ weeks: 1 }).startOf("week") }],
    ["thismonth", { unit: "month", date: DateTime.local().startOf("month") }],
    ["lastmonth", { unit: "month", date: DateTime.local().minus({ months: 1 }).startOf("month") }],
    ["nextmonth", { unit: "month", date: DateTime.local().plus({ months: 1 }).startOf("month") }],
    ["thisyear", { unit: "year", date: DateTime.local().startOf("year") }],
    ["lastyear", { unit: "year", date: DateTime.local().minus({ years: 1 }).startOf("year") }],
    ["nextyear", { unit: "year", date: DateTime.local().plus({ years: 1 }).startOf("year") }],
    ["thisquarter", { unit: "quarter", date: DateTime.local().startOf("quarter") }],
    ["lastquarter", { unit: "quarter", date: DateTime.local().minus({ quarters: 1 }).startOf("quarter") }],
    ["nextquarter", { unit: "quarter", date: DateTime.local().plus({ quarters: 1 }).startOf("quarter") }],
]);

export default class FilterValuesMapper {
    public static toCalendarValue(filterValue: string): FilterCalendarResponse {
        if (filterValue.startsWith("@")) {
            const potentialDate = valueToCalendarConverter.get(filterValue.slice(1).toLowerCase());
            return potentialDate ? potentialDate : valueToCalendarConverter.get("today");
        }
        const potentialDate = DateTime.fromISO(filterValue);
        return { unit: "day", date: potentialDate.isValid ? potentialDate : DateTime.local() };
    }
}