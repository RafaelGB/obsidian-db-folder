import { Row } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";

function customSortingFn(rowA: Row<RowDataType>, rowB: Row<RowDataType>, columnId: string): number {
    const a = rowA.getValue(columnId);
    const b = rowB.getValue(columnId);
    if (areEqual(a, b)) {
        return 0;
    }
    if (a == null) {
        return -1;
    }

    if (b == null) {
        return 1;
    }

    return fallback(a, b);
}
function areEqual(a: any, b: any): boolean {
    // It is necessary?
    if (a == null && b == null) {
        return true;
    }
    return a === b;
}

function fallback(a: any, b: any): number {
    return isNaN(a)
        ? a.localeCompare(b)
        : a - b;
}

export default customSortingFn;