import { DatabaseColumn } from "cdm/DatabaseModel";
import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { DatabaseView } from "views/DatabaseView";
import { DEFAULT_COLUMN_CONFIG, DynamicInputType, TableColumnsTemplate } from "helpers/Constants";
import { dbTrim } from "helpers/StylesHelper";
import { Notice } from "obsidian";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class InsertColumnHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;

        implementation.actions.addToLeft = (column: TableColumn, customName?: string, customType: string = DynamicInputType.TEXT) =>
            set((updater) => {
                const index = updater.columns.findIndex(
                    (col) => col.key === column.key
                );
                const alteredColumns = this.generateNewColumn(view, updater, index, column.position - 1, customName, customType);
                return { columns: alteredColumns };
            });

        implementation.actions.addToRight = (column: TableColumn, customName?: string, customType: string = DynamicInputType.TEXT) =>
            set((updater) => {
                const index = updater.columns.findIndex(
                    (col) => col.key === column.key
                );
                const alteredColumns = this.generateNewColumn(view, updater, index + 1, column.position + 1, customName, customType);
                return { columns: alteredColumns };
            });

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }

    /**
     * Generate new column in function of the position
     * @param view 
     * @param updater 
     * @param index 
     * @param desiredPosition 
     * @returns 
     */
    private generateNewColumn(view: DatabaseView, updater: ColumnsState, index: number, desiredPosition: number, customName?: string, customType?: string): TableColumn[] {
        const columnInfo = this.generateNewColumnInfo(
            desiredPosition,
            updater.columns,
            updater.shadowColumns,
            customName
        );
        // If the custom type is one of special types, we need to set the inline config to true
        const isSpecialType = customType === DynamicInputType.RELATION;
        const isInline = isSpecialType || view.diskConfig.yaml.config.inline_default;

        const newColumn: DatabaseColumn = {
            input: customType,
            accessorKey: columnInfo.name,
            key: columnInfo.name,
            id: columnInfo.name,
            label: columnInfo.label,
            position: columnInfo.position,
            config: {
                ...DEFAULT_COLUMN_CONFIG,
                isInline: isInline
            },
        };


        view.diskConfig.addColumn(columnInfo.name, newColumn);

        const newColumns = [
            ...updater.columns.slice(0, index),
            {
                ...TableColumnsTemplate,
                input: newColumn.input,
                id: newColumn.key,
                label: newColumn.label,
                key: newColumn.key,
                accessorKey: newColumn.accessorKey,
                position: newColumn.position,
                csvCandidate: true,
                config: newColumn.config,
            },
            ...updater.columns.slice(index, updater.columns.length),
        ];
        return newColumns;
    }

    /**
     * Adjust width of the columns when add a new column.
     * @param wantedPosition
     * @returns
     */
    private generateNewColumnInfo(
        wantedPosition: number,
        columns: TableColumn[],
        shadowColumns: TableColumn[],
        customName?: string
    ) {
        if (customName !== undefined) {
            let sufixAdded = false;
            let copyIndex = 1;
            const originalName = customName;

            while (columns.find((o) => o.id === customName)) {
                customName = `${originalName} ${copyIndex}`;
                copyIndex++;
                sufixAdded = true;
            }

            if (sufixAdded) {
                new Notice(`The column name already exist. Sufix was added`, 1500);
            }
            return {
                name: dbTrim(customName),
                label: customName,
                position: wantedPosition,
            };
        }

        let columnNumber = columns.length - shadowColumns.length;
        // Check if column name already exists
        while (columns.find((o) => o.id === `newColumn${columnNumber}`)) {
            columnNumber++;
        }
        const columnId = `newColumn${columnNumber}`;
        const columnLabel = `New Column ${columnNumber}`;
        return { name: columnId, position: wantedPosition, label: columnLabel };
    }
}
