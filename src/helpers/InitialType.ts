import { ColumnSort } from "@tanstack/react-table";
import { InitialType, TableColumn } from "cdm/FolderModel";

function obtainInitialType(columns: TableColumn[]): InitialType {
    const initialType: InitialType = {};
    const sortElemList: ColumnSort[] = [];
    columns.forEach((column: TableColumn) => {
        if (column.isSorted) {
            sortElemList.push({
                id: column.key,
                desc: column.isSortedDesc,
            });
        }
    });
    // Sort by index
    sortElemList.sort((a: ColumnSort, b: ColumnSort) => {
        const aIndex = columns.find((column: TableColumn) => column.key === a.id)?.sortIndex;
        const bIndex = columns.find((column: TableColumn) => column.key === b.id)?.sortIndex;
        if (aIndex === -1 || bIndex === -1) {
            return 0;
        }
        return aIndex - bIndex;
    });

    initialType.sortBy = sortElemList;
    return initialType;
}
export default obtainInitialType;