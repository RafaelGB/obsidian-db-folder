import { FooterType } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";

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
                case FooterType.NONE:
                default:
                    footerInfo = "";
            }
        } catch (e) {
            footerInfo = `Error: ${e.message}`;
        } finally {
            return footerInfo;
        }
    }

    public sum(): string {
        const total = this.colValues
            .filter((value) => !Number.isNaN(Number(value)))
            .reduce((acc: number, value: number) => acc + value, 0);
        return `Total: ${total}`;
    }

    public min(): string {
        const min = this.colValues
            .filter((value) => !Number.isNaN(Number(value)))
            .reduce((acc: number, value: number) => Math.min(acc, value), Number.MAX_SAFE_INTEGER);
        return `Min: ${min}`;
    }

    public max(): string {
        const max = this.colValues
            .filter((value) => !Number.isNaN(Number(value)))
            .reduce((acc: number, value: number) => Math.max(acc, value), Number.MIN_SAFE_INTEGER);
        return `Max: ${max}`;
    }

    public countUnique(): string {
        const uniqueValues = new Set();
        this.colValues
            .filter((value) => value !== undefined)
            .forEach((value) => {
                uniqueValues.add(value);
            });
        return `Unique: ${uniqueValues.size}`;
    }

    public countEmpty(): string {
        const empty = this.colValues
            .filter((value) => !DataviewService.getDataviewAPI().value.isTruthy(value)).length;
        return `Empty: ${empty}`;
    }

    public percentEmpty(): string {
        const empty = this.colValues
            .filter((value) => !DataviewService.getDataviewAPI().value.isTruthy(value)).length;
        return `Empty: ${(empty / this.colValues.length * 100).toFixed(2)}%`;
    }

    public countFilled(): string {
        const filled = this.colValues
            .filter((value) => DataviewService.getDataviewAPI().value.isTruthy(value)).length;
        return `Filled: ${filled}`;
    }

    public percentFilled(): string {
        const filled = this.colValues
            .filter((value) => DataviewService.getDataviewAPI().value.isTruthy(value)).length;
        return `Filled: ${(filled / this.colValues.length * 100).toFixed(2)}%`;
    }

}