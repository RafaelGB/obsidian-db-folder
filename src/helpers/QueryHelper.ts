import { DatabaseColumn } from "cdm/DatabaseModel";
import { DatabaseCore } from "helpers/Constants";

export function generateDataviewTableQuery(columns: Record<string, DatabaseColumn>, fromQuery: string): string {
    return `TABLE ${Object.keys(columns)
        .filter((key) => !key.startsWith("__") && !key.endsWith("__"))
        .join(",")},${DatabaseCore.DATAVIEW_FILE},${DatabaseCore.FRONTMATTER_KEY} ${fromQuery.replace(/['"]+/g, '')}`
}