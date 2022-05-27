import { InitialState, RowDataType, SortByElement, TableColumn } from "cdm/FolderModel";

function obtainInitialState(columns: TableColumn[], rows: RowDataType[]): InitialState {
    const initialState: InitialState = {};
    const sortElemList: SortByElement[] = [];
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