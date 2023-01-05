import { DbModule } from "lib/core/DbModule";
import { Literal } from "obsidian-dataview";
import { DateTime, DurationLikeObject } from "luxon";
import { DEFAULT_SETTINGS } from "helpers/Constants";
import { LuxonInterface } from "cdm/ModulesFnModel";


export class LuxonFn extends DbModule implements LuxonInterface {
    public name = "luxon";

    async create_static_functions(): Promise<void> {
        this.static_functions.set("earliest", this.earliest.bind(this));
        this.static_functions.set("latest", this.latest.bind(this));
        this.static_functions.set("range", this.range.bind(this));
        this.static_functions.set("dateToString", this.dateToString.bind(this));
        this.static_functions.set("stringToDate", this.stringToDate.bind(this));
    }

    async create_dynamic_functions(): Promise<void> {
        // No dynamic functions
    }

    parseRaw(rawValues: Literal[]): DateTime[] {
        return rawValues
            .filter((value) => DateTime.isDateTime(value))
            .map((value) => value as DateTime);
    }

    earliest(rawValues: Literal[]): DateTime {
        return DateTime.min(...this
            .parseRaw(rawValues))

    }

    latest(rawValues: Literal[]): DateTime {
        return DateTime.max(...this
            .parseRaw(rawValues))
    }

    range(rawValues: Literal[], dl: keyof DurationLikeObject = "days"): number {
        const earliest = this.earliest(rawValues);
        const latest = this.latest(rawValues);
        return latest.diff(earliest).as(dl);
    }

    dateToString(datetime: DateTime, format = DEFAULT_SETTINGS.local_settings.datetime_format) {
        const isDate = DateTime.isDateTime(datetime);
        return isDate
            ? datetime.toFormat(format) : null;
    }

    stringToDate(datetime: string, format = DEFAULT_SETTINGS.local_settings.datetime_format) {
        let result: DateTime = null;
        result = DateTime.fromFormat(datetime, format);
        if (!result.isValid) {
            result = null;
        }

        return result;
    }
}
