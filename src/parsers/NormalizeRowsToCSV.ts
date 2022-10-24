import { Row } from "@tanstack/react-table"
import { LabelKeyObject } from "react-csv/components/CommonPropTypes";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { MetadataColumns } from "helpers/Constants";
import { Link } from "obsidian-dataview";

export const normalizeRowsToCsvData = (rows: Row<RowDataType>[]): object[] => {
    // Filter out empty rows
    return sanitizeDataCSV(rows);
}
function sanitizeDataCSV(rows: Row<RowDataType>[]): object[] {
    const originalData: object[] = rows.map(row => row.original);
    const sanitizedData: object[] = [];
    Object.values(originalData).map(rowObject => {
        Object.entries(rowObject).map(([cellKey, cellValue]) => {
            switch (cellKey) {
                case MetadataColumns.FILE:
                    rowObject = updateFromPartial(rowObject, {
                        [cellKey]: (cellValue as Link).fileName()
                    });
                    break;
                default:
                    break;
            }
        });
        sanitizedData.push(rowObject);
    });

    return sanitizedData;
}

function updateFromPartial<T>(obj: T, updates: Partial<T>): T {
    return { ...obj, ...updates };
}

export const normalizeColumnsToCsvHeader = (columns: TableColumn[]): LabelKeyObject[] => {
    const headers = columns.filter(f => f.csvCandidate);

    return sanitizeHeadersCSV(headers);
}

function sanitizeHeadersCSV(headers: TableColumn[]): LabelKeyObject[] {
    const sanitized: LabelKeyObject[] = [];
    headers.forEach(header => {
        sanitized.push({ key: header.id, label: header.label });
    });
    return sanitized;
}