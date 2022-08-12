import { TableColumn } from "cdm/FolderModel";
import { DatabaseCore } from "helpers/Constants";

export function generateDataviewTableQuery(columns: TableColumn[], fromQuery: string): string {
    return `TABLE ${columns
        .filter((col) => !col.isMetadata)
        .map((col) => col.key)
        .join(",")},${DatabaseCore.DATAVIEW_FILE},${DatabaseCore.FRONTMATTER_KEY} ${fromQuery}`
}