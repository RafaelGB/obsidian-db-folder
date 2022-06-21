import { RowDatabaseFields } from "cdm/DatabaseModel";
import { TableColumn } from "cdm/FolderModel";
import { DataTypes } from "helpers/Constants";
import { TFile } from "obsidian";
import { DataArray } from "obsidian-dataview/lib/api/data-array";
import { DataviewService } from "services/DataviewService";

/**
 * Obtain both frontmatter and inline fields from a file.
 * Use column information to determine which fields are frontmatter and which are inline.
 * @param file 
 * @param columns 
 * @returns 
 */
const obtainRowDatabaseFields = (file: TFile, columns: TableColumn[], frontmatterKeys: string[]): RowDatabaseFields => {
    const columnsToPersist = columns.filter(c => !c.isMetadata);
    const currentFileFields = DataviewService.getDataviewAPI().page(file.path);
    const filteredFields: RowDatabaseFields = { frontmatter: {}, inline: {} };
    const columnKeys = columnsToPersist.map(c => c.key);

    Object.keys(currentFileFields)
        .forEach(fieldKey => {
            // Parse nullable fields
            const fieldValue = DataviewService.getDataviewAPI().value.isTruthy(currentFileFields[fieldKey].toString())
                ? currentFileFields[fieldKey] : "";
            // Then classify fields into frontmatter and inline
            let forceInline = false;
            if (columnKeys.includes(fieldKey)) {
                forceInline = columnsToPersist.find(c => c.key === fieldKey).config.isInline
            }
            if (forceInline || !frontmatterKeys.includes(fieldKey)) {
                filteredFields.inline[fieldKey] = fieldValue;
            } else {
                filteredFields.frontmatter[fieldKey] = fieldValue;
            }
        });
    return filteredFields;
};

export default obtainRowDatabaseFields;