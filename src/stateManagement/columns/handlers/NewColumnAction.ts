import { DatabaseColumn } from "cdm/DatabaseModel";
import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import { DEFAULT_COLUMN_CONFIG, InputType, TableColumnsTemplate } from "helpers/Constants";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class InsertColumnHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;

        implementation.addToLeft = (column: TableColumn) =>
            set((updater) => {
                const index = updater.columns.findIndex(
                    (col) => col.id === column.id
                );
                const alteredColumns = this.generateNewColumn(view, updater, index, column.position - 1);
                return { columns: alteredColumns };
            });

        implementation.addToRight = (column: TableColumn) =>
            set((updater) => {
                const index = updater.columns.findIndex(
                    (col) => col.id === column.id
                );
                const alteredColumns = this.generateNewColumn(view, updater, index + 1, column.position + 1);
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
    private generateNewColumn(view: DatabaseView, updater: ColumnsState, index: number, desiredPosition: number): TableColumn[] {
        const columnInfo = this.generateNewColumnInfo(
            desiredPosition,
            updater.columns,
            updater.shadowColumns
        );
        const newLeftColumn: DatabaseColumn = {
            input: InputType.TEXT,
            accessorKey: columnInfo.name,
            key: columnInfo.name,
            label: columnInfo.label,
            position: columnInfo.position,
            config: DEFAULT_COLUMN_CONFIG,
        };
        view.diskConfig.addColumn(columnInfo.name, newLeftColumn);

        const newColumns = [
            ...updater.columns.slice(0, index),
            {
                ...TableColumnsTemplate,
                input: newLeftColumn.input,
                id: newLeftColumn.key,
                label: newLeftColumn.label,
                key: newLeftColumn.key,
                accessorKey: newLeftColumn.accessorKey,
                position: newLeftColumn.position,
                csvCandidate: true,
                config: newLeftColumn.config,
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
        shadowColumns: TableColumn[]
    ) {
        let columnNumber = columns.length - shadowColumns.length;
        // Check if column name already exists
        while (columns.find((o: any) => o.id === `newColumn${columnNumber}`)) {
            columnNumber++;
        }
        const columnId = `newColumn${columnNumber}`;
        const columnLabel = `New Column ${columnNumber}`;
        return { name: columnId, position: wantedPosition, label: columnLabel };
    }
}
