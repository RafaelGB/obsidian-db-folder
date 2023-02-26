import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { UpdateRowOptions } from "helpers/Constants";
import { dbTrim } from "helpers/StylesHelper";
import { EditEngineService } from "services/EditEngineService";
import { RelationalService } from "services/RelationalService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class UpdateDataAfterLabelChangeHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { get, set, implementation } = tableActionResponse;
        implementation.actions.updateDataAfterLabelChange = async (column: TableColumn, label: string, columns: TableColumn[], ddbbConfig: LocalSettings) => {
            const newKey = dbTrim(label);
            // Save on disk
            get().rows.map(async (row: RowDataType) => {
                await EditEngineService.updateRowFileProxy(
                    row.__note__.getFile(),
                    column.key,
                    newKey,
                    columns,
                    ddbbConfig,
                    UpdateRowOptions.COLUMN_KEY
                );
            });
            if (column.config.related_note_path) {
                const { relatedRows, ddbbInfo } = await RelationalService.obtainInfoFromRelation(
                    column.config.related_note_path
                );
                relatedRows.map(async (row: RowDataType) => {
                    await EditEngineService.updateRowFileProxy(
                        row.__note__.getFile(),
                        column.key,
                        newKey,
                        columns,
                        ddbbInfo.yaml.config,
                        UpdateRowOptions.COLUMN_KEY
                    );
                });
            }
            set((state) => {
                // Save on memory
                const alterRows = state.rows.map((row) => {
                    row[newKey] = row[column.key];
                    delete row[column.key];
                    return row;
                });
                return { rows: alterRows };
            });
        }
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}