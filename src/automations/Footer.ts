import { Row } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";

export default class Footer {
    constructor(public readonly rows: Row<RowDataType>[]) { }

    public sum(key: string): string {
        const total = this.rows.reduce((acc, row) => acc + Number(row.getValue<number>(key)), 0);
        return `Total: ${total}`;
    }

    public countUnique(key: string): string {
        const uniqueValues = new Set();
        this.rows.forEach((row) => {
            uniqueValues.add(row.getValue(key));
        });
        return `Unique: ${uniqueValues.size}`;
    }

    public percentEmpty(key: string): string {
        const empty = this.rows.filter((row) => !row.getValue(key)).length;
        return `Empty: ${empty} (${(empty / this.rows.length * 100).toFixed(2)}%)`;
    }

    public percentFilled(key: string): string {
        const filled = this.rows.filter((row) => row.getValue(key)).length;
        return `Filled: ${filled} (${(filled / this.rows.length * 100).toFixed(2)}%)`;
    }

}