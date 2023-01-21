import { DEFAULT_SETTINGS, InputType } from "helpers/Constants";
import { DataObject, Literal } from "obsidian-dataview";
import * as Papa from "papaparse";
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
     * Parse a Csv DataObject to a Literal
     * @param value 
     * @returns 
     */
    parseFrontmatter(value: unknown): Literal {
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

export const CsvService = CsvToRows.getInstance();