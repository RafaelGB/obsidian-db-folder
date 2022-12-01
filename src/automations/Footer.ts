import { Row } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";

export default class Footer {
    constructor(public readonly rows: Row<RowDataType>[]) { }

    public sum(key: string): string {
        const total = this.rows.reduce((acc, row) => acc + row.getValue<number>(key), 0);
        return `Total: ${total}`;
    }
}