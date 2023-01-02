import { Literal } from "obsidian-dataview"
import { DateTime, DurationLikeObject } from "luxon";

type NumbersFnType = {
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
    [key: string]: unknown
}

type LuxonFnType = {
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
    [key: string]: unknown
}

/**
 * Exposed functionalities under the `db` variable of Formulas
 */
export type DatabaseFnType = {
    numbers: NumbersFnType;
    luxon: LuxonFnType;
    [key: string]: unknown
}