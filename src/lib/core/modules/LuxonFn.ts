import { DbModule } from "lib/core/DbModule";
import { Literal } from "obsidian-dataview";
import { DateTime, DurationLikeObject } from "luxon";

export class LuxonFn extends DbModule {
    public name: string = "luxon";

    async create_static_functions(): Promise<void> {
        this.static_functions.set("earliest", this.earliest.bind(this));
        this.static_functions.set("latest", this.latest.bind(this));
        this.static_functions.set("range", this.rangeDate.bind(this));
    }

    async create_dynamic_functions(): Promise<void> { }

    private parseRaw(rawValues: Literal[]): DateTime[] {
        return rawValues
            .filter((value) => DateTime.isDateTime(value))
            .map((value) => value as DateTime);
    }

    /**
     * Obtains the earliest date of the column (only for dates)
     * @param rawValues 
     * @returns 
     */
    private earliest(rawValues: Literal[]): DateTime {
        return DateTime.min(...this
            .parseRaw(rawValues))

    }

    /**
     * Obtains the latest date of the column (only for dates)
     * @returns 
     */
    private latest(rawValues: Literal[]): DateTime {
        return DateTime.max(...this
            .parseRaw(rawValues))
    }

    /**
     * Obtains a range of dates of the column (only for dates) in a given duration
     * @returns
     */
    private rangeDate(rawValues: Literal[], dl: keyof DurationLikeObject = "days"): number {
        const earliest = this.earliest(rawValues);
        const latest = this.latest(rawValues);
        return latest.diff(earliest).as(dl);
    }
}
