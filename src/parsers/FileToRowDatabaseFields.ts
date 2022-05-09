import { RowDatabaseFields } from "cdm/DatabaseModel";
import { TableColumn } from "cdm/FolderModel";
import { TFile } from "obsidian";
import { DataviewService } from "services/DataviewService";


const obtainRowDatabaseFields = (file: TFile, columns: TableColumn[]): RowDatabaseFields => {
    const columnsToPersist = columns.filter(c => !c.isMetadata);
    const currentFileFields = DataviewService.getDataviewAPI().page(file.path);
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