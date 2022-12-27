import { SUGGESTER_REGEX } from "helpers/Constants";
import { DataObject, Literal } from "obsidian-dataview/lib/data-model/value";
import { LOGGER } from "services/Logger";
import { DataviewService } from "services/DataviewService";
import { LocalSettings } from "cdm/SettingsModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { deepMerge, generateLiteral, obtainAnidatedLiteral } from "helpers/DataObjectHelper";
import ParseBuilder from "./parseServiceHelpers/ParseBuilder";

class Parse {

    private static instance: Parse;

    /**
     * Universal parse method to parse a literal to a specific type
     * @param literal 
     * @param dataTypeDst 
     * @param localSettings 
     * @param isInline 
     * @returns 
     */
    public parseLiteral(literal: Literal, dataTypeDst: string, localSettings: LocalSettings, isInline = false, wrapQuotes = false): Literal {
        // Check empty or undefined literals
        if (!DataviewService.isTruthy(literal?.toString())) {
            return "";
        }
        literal = this.parseDataArray(literal);
        const wrapped = DataviewService.wrapLiteral(literal);
        return ParseBuilder
            .setType(dataTypeDst, localSettings, isInline, wrapQuotes)
            .parseLiteral(wrapped);

    }

    /**
     * Check if literal is Proxy DataArray, if so, parse it. If not, return same literal
     * @param literal 
     * @returns 
     */
    public parseDataArray(literal: Literal): Literal {
        if (literal === null || literal === undefined) {
            return literal;
        }

        if (DataviewService.getDataviewAPI().isDataArray(literal)) {
            literal = literal.values
        }

        return literal;
    }

    /**
     * Manage the value of the rendered string to save as Literal cell
     * @param row
     * @param column
     * @param newValue
     * @returns
     */
    public parseRowToLiteral(
        row: RowDataType,
        column: TableColumn,
        newValue: Literal
    ): Literal {
        if (typeof newValue === "string") {
            try {
                // Check if is a valid JSON
                if (newValue.startsWith("{") && newValue.endsWith("}")) {
                    newValue = JSON.parse(newValue);
                } else if (SUGGESTER_REGEX.TEXT_ARRAY.test(newValue)) {
                    // Remove brackets
                    newValue = newValue.replaceAll(SUGGESTER_REGEX.TEXT_ARRAY, "$2");
                    // Split by comma
                    newValue = newValue.split(",");
                }
            } catch (e) {
                // Do nothing
            }
        }
        if (column.nestedKey) {
            try {
                const originalValue = row[column.key];
                // Generate object with the new value using the nested key anidated in fuction of split .
                const target = (originalValue as DataObject) ?? {};
                const source = generateLiteral(column.nestedKey, newValue);
                return deepMerge(source, target);
            } catch (e) {
                LOGGER.error(`Error parsing row to literal: ${e}`);
                newValue = "";
            }
        }
        return newValue;
    }

    /**
     * Manage the value of the cell in function of the type of the column
     * @param row
     * @param column
     * @param config
     * @returns
     */
    public parseRowToCell(row: RowDataType, column: TableColumn, type: string, config: LocalSettings): Literal {
        let literal = row[column.key] as Literal;
        if (column.nestedKey && literal !== undefined) {
            literal = obtainAnidatedLiteral(column.nestedKey, literal, type, config);
        }
        return this.parseLiteral(literal, type, config);
    }

    /**
     * Singleton instance
     * @returns {VaultManager}
     */
    public static getInstance(): Parse {
        if (!this.instance) {
            this.instance = new Parse();
        }
        return this.instance;
    }
}

export const ParseService = Parse.getInstance();