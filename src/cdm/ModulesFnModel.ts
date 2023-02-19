import { Literal } from "obsidian-dataview"
import { DateTime, DurationLikeObject } from "luxon";
import { HSL } from "obsidian";

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

export interface ColorsInterface {
    /**
     * Converts a color from HSL to String
     * @param hsl 
     * @returns @type {string} color
     */
    hslToString(hsl: HSL): string;

    /**
     * Transform a string to a valid HSL color or return a default color if the string is not valid
     * expected string format: `hsl(0-360, 0-100%, 0-100%)`
     * I.E.: 
     * str `hsl(5, 60%, 20%)` returns {h: 5, s: 60, l: 20}
     * @param str 
     * @returns @type {HSL} object
     */
    stringtoHsl(str: string): HSL;

    /**
     * Get the contrast color for a given HSL color based on the luminosity of the color
     * @param str or HSL object 
     * @returns @type {string} color
     */
    getContrast(hsl: HSL | string): string;

    /**
     * Generate a random color in HSL format under a string type
     * @returns @type {string} color
     */
    randomColor(): string;

    /**
     * Between a scale from 0 to 9, returns a grey tone color in Hex format. Default value is 5 (medium grey)
     * @param value 
     */
    greyScale(value?: number): string;
}

/**
 * Exposed functionalities under the `db` variable of Formulas
 */
export type DatabaseFnType = {
    numbers: NumbersInterface;
    luxon: LuxonInterface;
    colors: ColorsInterface;
}