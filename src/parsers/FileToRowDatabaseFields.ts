import { RowDatabaseFields } from "cdm/DatabaseModel";
import { TableColumn } from "cdm/FolderModel";
import { TFile } from "obsidian";
import { getDataviewAPI } from "services/DataviewService";


const obtainRowDatabaseFields = (file: TFile, columns: TableColumn[]): RowDatabaseFields => {
    const columnsToPersist = columns.filter(c => !c.isMetadata);
    const currentFileFields = getDataviewAPI().page(file.path);
    const filteredFields: RowDatabaseFields = { frontmatter: {}, inline: {} };

    columnsToPersist.forEach(column => {
        const fieldValue = currentFileFields[column.key] ?? "";
        if (column.isInline) {
            filteredFields.inline[column.key] = fieldValue;
        } else {
            filteredFields.frontmatter[column.key] = fieldValue;
        }
    });
    return filteredFields;
};

export default obtainRowDatabaseFields;