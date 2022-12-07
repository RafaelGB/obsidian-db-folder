import { Row } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { FooterType } from "helpers/Constants";
import { Literal } from "obsidian-dataview";

export default class Footer {
    constructor(public readonly rows: Row<RowDataType>[]) { }

    public dispatch(footerType: string, key: string): string {
        let footerInfo: string;
        try {
            switch (footerType) {
                case FooterType.COUNT_UNIQUE:
                    footerInfo = this.countUnique(key);
                    break;
                case FooterType.COUNT_EMPTY:
                    footerInfo = this.countEmpty(key);
                    break;
                case FooterType.PERCENT_EMPTY:
                    footerInfo = this.percentEmpty(key);
                    break;
                case FooterType.COUNT_FILLED:
                    footerInfo = this.countFilled(key);
                    break;
                case FooterType.PERCENT_FILLED:
                    footerInfo = this.percentFilled(key);
                    break;
                case FooterType.SUM:
                    footerInfo = this.sum(key);
                    break;
                case FooterType.MIN:
                    footerInfo = this.min(key);
                    break;
                case FooterType.MAX:
                    footerInfo = this.max(key);
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

    public sum(key: string): string {
        const total = this.rows
            .filter((row) => !Number.isNaN(Number(row.getValue<Literal>(key))))
            .reduce((acc, row) => acc + row.getValue<number>(key), 0);
        return `Total: ${total}`;
    }

    public min(key: string): string {
        const min = this.rows.reduce((acc, row) => Math.min(acc, row.getValue<number>(key)), Number.MAX_SAFE_INTEGER);
        return `Min: ${min}`;
    }

    public max(key: string): string {
        const max = this.rows.reduce((acc, row) => Math.max(acc, row.getValue<number>(key)), Number.MIN_SAFE_INTEGER);
        return `Max: ${max}`;
    }

    public countUnique(key: string): string {
        const uniqueValues = new Set();
        this.rows
            .filter((row) => row.getValue(key) !== undefined)
            .forEach((row) => {
                uniqueValues.add(row.getValue(key));
            });
        return `Unique: ${uniqueValues.size}`;
    }

    public countEmpty(key: string): string {
        const empty = this.rows.filter((row) => !row.getValue(key)).length;
        return `Empty: ${empty}`;
    }

    public percentEmpty(key: string): string {
        const empty = this.rows.filter((row) => !row.getValue(key)).length;
        return `Empty: ${(empty / this.rows.length * 100).toFixed(2)}%`;
    }

    public countFilled(key: string): string {
        const filled = this.rows.filter((row) => row.getValue(key)).length;
        return `Filled: ${filled}`;
    }

    public percentFilled(key: string): string {
        const filled = this.rows.filter((row) => row.getValue(key)).length;
        return `Filled: ${(filled / this.rows.length * 100).toFixed(2)}%`;
    }

}