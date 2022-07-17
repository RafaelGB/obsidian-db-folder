import { TableColumn } from "cdm/FolderModel";

const getInitialColumnSizing = (columns: TableColumn[]) => {
    const columnSizing: Record<string, number> = {};
    columns.forEach(column => {
        columnSizing[column.id] = column.width;
    }
    );
    return columnSizing;
}
export default getInitialColumnSizing;