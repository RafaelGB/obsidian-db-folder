import { ColumnSort } from "@tanstack/react-table";
import { InitialState, RowDataType, TableColumn } from "cdm/FolderModel";

function obtainInitialState(columns: TableColumn[], rows: RowDataType[]): InitialState {
    const initialState: InitialState = {};
    const sortElemList: ColumnSort[] = [];
    columns.forEach((column: TableColumn) => {
        if (column.isSorted) {
            sortElemList.push({
                id: column.key,
                desc: column.isSortedDesc
            });
        }
    });
    initialState.sortBy = sortElemList;
    return initialState;
}
export default obtainInitialState;