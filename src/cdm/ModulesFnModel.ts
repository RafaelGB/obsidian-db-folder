import { Literal } from "obsidian-dataview"
import { DateTime, DurationLikeObject } from "luxon";

export interface NumbersInterface {
    /**
     * Summatory of the list of values
     * @param values 
     * @returns 
     */
    sum: (values: Literal[]) => number;

    /**
     * Obtains the minimum value of the list of values
     * @param values
     * @returns
     */
    min: (values: Literal[]) => number;

    /**
     * Obtains the maximum value of the list of values
     * @param values
     * @returns
     */
    max: (values: Literal[]) => number;
}

export interface LuxonInterface {
    /**
     * Returns the earliest date in the list of values
     * @param values 
     * @returns 
     */
    earliest: (values: Literal[]) => DateTime;

    /**
     * Returns the latest date in the list of values
     * @param values
     * @returns
     */
    latest: (values: Literal[]) => DateTime;

    /**
     * Returns the duration between the earliest and latest dates in the list of values
     * @param values
     * @param dl - Duration like object key. "days" by default. See https://www.jsdocs.io/package/@types/luxon#DurationLikeObject
     * @returns
     */
    range: (values: Literal[], dl?: keyof DurationLikeObject) => number;

    /**
     * Parse datetime to string under a given format
     * @param datetime 
     * @param format - Default: yyyy-MM-dd HH:mm:ss
     * @returns 
     */
    dateToString: (datetime: DateTime, format?: string) => string;

    /**
     * Parse string to datetime under a given format
     * @param datetime 
     * @param format - Default: yyyy-MM-dd HH:mm:ss  
     * @returns 
     */
    stringToDate(datetime: string, format?: string): DateTime;
}

/**
 * Exposed functionalities under the `db` variable of Formulas
 */
export type DatabaseFnType = {
    numbers: NumbersInterface;
    luxon: LuxonInterface;
    [key: string]: unknown
}