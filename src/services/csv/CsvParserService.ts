import { Row } from "@tanstack/react-table";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { CsvHeaders } from "cdm/ServicesModel";
import { DEFAULT_SETTINGS, InputType, MetadataColumns } from "helpers/Constants";
import { DataObject, Link, Literal } from "obsidian-dataview";
import * as Papa from "papaparse";
import { updateFromPartial } from "patterns/Objects";
import { ParseService } from "services/ParseService";

class CsvToRows {
    private static instance: CsvToRows;

    /**
     * Parse a csv string to an array of DataObject
     * @param csv 
     * @returns 
     */
    parseCSV(csv: string | ArrayBuffer): DataObject[] {
        let parsed = Papa.parse(csv.toString(), {
            header: true,
            skipEmptyLines: true,
            comments: "#",
            dynamicTyping: true,
        });

        const rows = [];
        for (const parsedRow of parsed.data) {
            const fields = this.parseFrontmatter(parsedRow) as DataObject;
            const result: DataObject = {};

            for (const [key, value] of Object.entries(fields)) {
                result[key] = value;
            }

            rows.push(result);
        }
        return rows;
    }

    /**
     * Obtain the headers of a csv file as an array of CsvHeaders
     * @param columns 
     * @returns 
     */
    getCsvHeaders(columns: TableColumn[]): CsvHeaders[] {
        const headers = columns.filter(f => f.csvCandidate);

        return this.sanitizeHeadersCSV(headers);
    }

    /**
     * Normalize the rows to a csv data object array
     * @param rows 
     * @returns 
     */
    normalizeRowsToCsvData = (rows: Row<RowDataType>[]): RowDataType[] => {
        const originalData: RowDataType[] = rows.map(row => row.original);
        const sanitizedData: RowDataType[] = [];
        Object.values(originalData).map(rowObject => {
            Object.entries(rowObject).map(([cellKey, cellValue]) => {
                switch (cellKey) {
                    case MetadataColumns.FILE:
                        rowObject = updateFromPartial(rowObject, {
                            [cellKey]: (cellValue as Link).path
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

    private sanitizeHeadersCSV(headers: TableColumn[]): CsvHeaders[] {
        const sanitized: CsvHeaders[] = [];
        headers.forEach(header => {
            sanitized.push({ key: header.id, label: header.label });
        });
        return sanitized;
    }

    /**
     * Parse a Csv DataObject to a Literal
     * @param value 
     * @returns 
     */
    private parseFrontmatter(value: unknown): Literal {
        if (value == null) {
            return null;
        } else if (typeof value === "object") {
            if (Array.isArray(value)) {
                let result = [];
                for (let child of value as Array<any>) {
                    result.push(this.parseFrontmatter(child));
                    result.push(this.parseFrontmatter(child));
                }

                return result;
            } else {
                let object = value as Record<string, any>;
                let result: Record<string, Literal> = {};
                for (let key in object) {
                    result[key] = this.parseFrontmatter(object[key]);
                    result[key] = this.parseFrontmatter(object[key]);
                }

                return result;
            }
        } else if (typeof value === "number") {
            return value;
        } else if (typeof value === "boolean") {
            return value;
        } else if (typeof value === "string") {
            return ParseService.parseLiteral(value, InputType.TEXT, DEFAULT_SETTINGS.local_settings)
        }
        // Backup if we don't understand the type.
        return null;
    }

    /**
     * Singleton instance
     * @returns {VaultManager}
     */
    public static getInstance(): CsvToRows {
        if (!this.instance) {
            this.instance = new CsvToRows();
        }
        return this.instance;
    }
}

export const CsvParserService = CsvToRows.getInstance();