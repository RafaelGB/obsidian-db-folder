import { DateTime } from "luxon";
const valueToCalendarConverter = new Map<string, DateTime>([
    ["today", DateTime.local().startOf("day")],
    ["yesterday", DateTime.local().minus({ days: 1 }).startOf("day")],
    ["tomorrow", DateTime.local().plus({ days: 1 }).startOf("day")],
    ["thisweek", DateTime.local().startOf("week")],
    ["lastweek", DateTime.local().minus({ weeks: 1 }).startOf("week")],
    ["nextweek", DateTime.local().plus({ weeks: 1 }).startOf("week")],
    ["thismonth", DateTime.local().startOf("month")],
    ["lastmonth", DateTime.local().minus({ months: 1 }).startOf("month")],
    ["nextmonth", DateTime.local().plus({ months: 1 }).startOf("month")],
    ["thisyear", DateTime.local().startOf("year")],
    ["lastyear", DateTime.local().minus({ years: 1 }).startOf("year")],
    ["nextyear", DateTime.local().plus({ years: 1 }).startOf("year")],
    ["thisquarter", DateTime.local().startOf("quarter")],
    ["lastquarter", DateTime.local().minus({ quarters: 1 }).startOf("quarter")],
    ["nextquarter", DateTime.local().plus({ quarters: 1 }).startOf("quarter")],
]);

export default class FilterValuesMapper {
    public static toCalendarValue(filterValue: string): DateTime {
        if (filterValue.startsWith("@")) {
            const potentialDate = valueToCalendarConverter.get(filterValue.slice(1).toLowerCase());
            return potentialDate ? potentialDate : DateTime.local();
        }

        const potentialDate = DateTime.fromISO(filterValue);
        return potentialDate.isValid ? potentialDate : DateTime.local();
    }
}