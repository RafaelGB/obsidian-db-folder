import { DEFAULT_SETTINGS, FooterType } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { DbAutomationService } from "services/AutomationService";

export default class Footer {
    constructor(public readonly colValues: Literal[]) { }

    public dispatch(footerType: string): string {

        let footerInfo: string;
        try {
            switch (footerType) {
                case FooterType.COUNT_UNIQUE:
                    footerInfo = this.countUnique();
                    break;
                case FooterType.COUNT_EMPTY:
                    footerInfo = this.countEmpty();
                    break;
                case FooterType.PERCENT_EMPTY:
                    footerInfo = this.percentEmpty();
                    break;
                case FooterType.COUNT_FILLED:
                    footerInfo = this.countFilled();
                    break;
                case FooterType.PERCENT_FILLED:
                    footerInfo = this.percentFilled();
                    break;
                case FooterType.SUM:
                    footerInfo = this.sum();
                    break;
                case FooterType.MIN:
                    footerInfo = this.min();
                    break;
                case FooterType.MAX:
                    footerInfo = this.max();
                    break;
                case FooterType.EARLIEST_DATE:
                    footerInfo = this.earliestDate();
                    break;
                case FooterType.LATEST_DATE:
                    footerInfo = this.latestDate();
                    break;
                case FooterType.RANGE_DATE:
                    footerInfo = this.rangeDate();
                    break;
                case FooterType.NONE:
                default:
                    footerInfo = "";
            }
        } catch (e) {
            footerInfo = `Error: ${e.message}`;
        }
        return footerInfo;
    }
    /************************************************************************
     *                          Cross functions
     ************************************************************************/

    /**
     * Obtains the number of unique values in the column
     * @returns 
     */
    public countUnique(): string {
        const uniqueValues = new Set();
        this.colValues
            .filter((value) => value !== undefined)
            .forEach((value) => {
                uniqueValues.add(value);
            });
        return `Unique: ${uniqueValues.size}`;
    }

    /**
     * Obtains the number of empty values in the column
     * @returns 
     */
    public countEmpty(): string {
        const empty = this.colValues
            .filter((value) => !DataviewService.getDataviewAPI().value.isTruthy(value)).length;
        return `Empty: ${empty}`;
    }

    /**
     * Obtains the percentage of empty values in the column
     * @returns 
     */
    public percentEmpty(): string {
        const empty = this.colValues
            .filter((value) => !DataviewService.getDataviewAPI().value.isTruthy(value)).length;
        return `Empty: ${(empty / this.colValues.length * 100).toFixed(2)}%`;
    }

    /**
     * Obtains the number of filled values in the column
     * @returns 
     */
    public countFilled(): string {
        const filled = this.colValues
            .filter((value) => DataviewService.getDataviewAPI().value.isTruthy(value)).length;
        return `Filled: ${filled}`;
    }

    /**
     * Obtains the percentage of filled values in the column
     * @returns 
     */
    public percentFilled(): string {
        const filled = this.colValues
            .filter((value) => DataviewService.getDataviewAPI().value.isTruthy(value)).length;
        return `Filled: ${(filled / this.colValues.length * 100).toFixed(2)}%`;
    }
    /************************************************************************
     *                          Number functions
     ************************************************************************/

    /**
     * Obtains the sum of the column (only for numbers)
     * @returns 
     */
    public sum(): string {
        const total = DbAutomationService.coreFns.numbers.sum(this.colValues);
        return `Total: ${total}`;
    }

    /**
     * Obtains the minimum value of the column (only for numbers)
     * @returns 
     */
    public min(): string {
        const min = DbAutomationService.coreFns.numbers.min(this.colValues);
        return `Min: ${min}`;
    }

    /**
     * Obtains the maximum value of the column (only for numbers)
     * @returns 
     */
    public max(): string {
        const max = DbAutomationService.coreFns.numbers.max(this.colValues);
        return `Max: ${max}`;
    }

    /************************************************************************
     *                          Calendar functions
     ************************************************************************/
    /**
     * Obtains the earliest date of the column (only for dates)
     * @returns 
     */
    public earliestDate(): string {
        const earliest = DbAutomationService.coreFns.luxon.earliest(this.colValues);
        return earliest.isValid ?
            `Earliest: ${earliest.toFormat(DEFAULT_SETTINGS.local_settings.datetime_format)}` :
            null;
    }

    /**
     * Obtains the latest date of the column (only for dates)
     * @returns 
     */
    public latestDate(): string {
        const latest = DbAutomationService.coreFns.luxon.latest(this.colValues);
        return latest.isValid ?
            `Latest: ${latest.toFormat(DEFAULT_SETTINGS.local_settings.datetime_format)}` :
            null;
    }

    /**
     * Obtains the range of dates of the column (only for dates)
     * @returns 
     */
    public rangeDate(): string {
        const range = DbAutomationService.coreFns.luxon.range(this.colValues);
        return `Range: ${range} days`
    }

}