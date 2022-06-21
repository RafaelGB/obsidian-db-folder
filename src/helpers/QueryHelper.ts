import { DatabaseColumn } from "cdm/DatabaseModel";

export function generateDataviewTableQuery(columns: Record<string, DatabaseColumn>, fromQuery: string): string {
    return `TABLE ${Object.keys(columns)
        .filter((key) => !key.startsWith("__") && !key.endsWith("__"))
        .join(",")},file ${fromQuery}`
}