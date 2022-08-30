import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { MetadataColumns, UpdateRowOptions } from "helpers/Constants";
import { moveFile, updateRowFileProxy } from "helpers/VaultManagement";
import { Literal } from "obsidian-dataview";
import { DateTime } from "luxon";
import NoteInfo from "services/NoteInfo";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class UpdateCellHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.updateCell = (
            rowIndex: number,
            column: TableColumn,
            value: Literal,
            columns: TableColumn[],
            ddbbConfig: LocalSettings,
            isMovingFile?: boolean) => set((state) => {
                const modifiedRow = state.rows[rowIndex];
                let rowTFile = modifiedRow.__note__.getFile();

                // Update the row on memory
                modifiedRow[column.key] = value;

                // Row Rules
                if (ddbbConfig.show_metadata_modified) {
                    modifiedRow[MetadataColumns.MODIFIED] = DateTime.now();
                }

                // Update the row on disk
                if (isMovingFile && ddbbConfig.group_folder_column === column.id) {

                    const moveInfo = {
                        file: rowTFile,
                        id: column.id,
                        value: value,
                        columns: columns,
                        ddbbConfig: ddbbConfig,
                    }
                    moveFile(`${view.file.parent.path}/${value}`, moveInfo);
                    // Update row file
                    modifiedRow[
                        MetadataColumns.FILE
                    ] = `[[${view.file.parent.path}/${value}/${rowTFile.name}|${rowTFile.basename}]]`;
                    // Check if action.value is a valid folder name
                    const auxPath =
                        value !== ""
                            ? `${view.file.parent.path}/${value}/${rowTFile.name}`
                            : `${view.file.parent.path}/${rowTFile.name}`;

                    const recordRow: Record<string, Literal> = {};
                    Object.entries(modifiedRow).forEach(([key, value]) => {
                        recordRow[key] = value as Literal;
                    });

                    modifiedRow.__note__ = new NoteInfo({
                        ...recordRow,
                        file: {
                            path: auxPath,
                        },
                    });

                } else {
                    // Save on disk
                    updateRowFileProxy(
                        rowTFile,
                        column.id,
                        value,
                        columns,
                        ddbbConfig,
                        UpdateRowOptions.COLUMN_VALUE
                    );
                }
                // Update rows without re render
                state.rows[rowIndex] = modifiedRow;
                return { rows: state.rows };
            });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}