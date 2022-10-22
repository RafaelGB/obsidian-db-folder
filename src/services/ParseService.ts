import { InputType, MarkdownBreakerRules } from "helpers/Constants";
import { DataObject, Literal, WrappedLiteral } from "obsidian-dataview/lib/data-model/value";
import { DateTime } from "luxon";
import { LOGGER } from "services/Logger";
import { DataviewService } from "services/DataviewService";
import { LocalSettings } from "cdm/SettingsModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { deepMerge, generateLiteral, obtainAnidatedLiteral } from "helpers/DataObjectHelper";

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
    public parseLiteral(literal: Literal, dataTypeDst: string, localSettings: LocalSettings, isInline?: boolean): Literal {
        let parsedLiteral: Literal = literal;
        if (!DataviewService.isTruthy(literal?.toString())) {
            return "";
        }
        literal = this.parseDataArray(literal);
        const wrapped = DataviewService.wrapLiteral(literal);
        LOGGER.debug(`=>parseLiteral: type ${wrapped
            .type} to ${dataTypeDst}`);
        // Check empty or undefined literals
        switch (dataTypeDst) {
            case InputType.MARKDOWN:
                parsedLiteral = this.parseToMarkdown(wrapped, localSettings, isInline);
                break;
            case InputType.SORTING:
                parsedLiteral = this.parseToEnableSorting(wrapped, localSettings, isInline);
                break;
            case InputType.TAGS:
                parsedLiteral = this.parseToOptionsArray(wrapped);
                break;
            case InputType.CALENDAR:
                parsedLiteral = this.parseToCalendar(wrapped, localSettings.date_format);
                break;
            case InputType.CALENDAR_TIME:
                parsedLiteral = this.parseToCalendar(wrapped, localSettings.datetime_format);
                break;
            case InputType.METATADA_TIME:
                parsedLiteral = this.parseToCalendar(wrapped);
                break;
            case InputType.NUMBER:
                parsedLiteral = this.parseToNumber(wrapped);
                break;
            case InputType.CHECKBOX:
                parsedLiteral = this.parseToBoolean(wrapped);
                break;
            case InputType.TASK:
            case InputType.FORMULA:
            case InputType.INLINKS:
            case InputType.OUTLINKS:
                // Do nothing
                break;
            default:
                parsedLiteral = this.parseToText(wrapped, localSettings);

        }
        LOGGER.debug(`<=parseLiteral`);
        return parsedLiteral;
    }

    /**
     * Check if literal is Proxy DataArray, if so, parse it. If not, return same literal
     * @param literal 
     * @returns 
     */
    public parseDataArray(literal: Literal): Literal {
        if ((literal as any).values !== undefined && (literal as any).settings !== undefined) {
            literal = (literal as any).values
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
                newValue = JSON.parse(newValue);
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
                // Just return the original value
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

    private parseToCalendar(wrapped: WrappedLiteral, format?: string): DateTime {
        if (wrapped.type === 'string') {
            let calendarCandidate;
            if (format) {
                calendarCandidate = DateTime.fromFormat(wrapped.value, format);
            } else {
                calendarCandidate = DateTime.fromISO(wrapped.value);
            }

            if (calendarCandidate.isValid) {
                return calendarCandidate;
            }
            return null;
        }

        if (DateTime.isDateTime(wrapped.value)) {
            return wrapped.value;
        } else {
            return null;
        }
    }

    private parseToText(wrapped: WrappedLiteral, localSettings: LocalSettings): string | DataObject {
        switch (wrapped.type) {
            case 'object':
                if (DateTime.isDateTime(wrapped.value)) {
                    return wrapped.value.toFormat(localSettings.datetime_format);
                } else {
                    try {
                        // Try to parse to JSON
                        return JSON.stringify(wrapped.value);
                    } catch (e) {
                        // Do nothing
                    }
                    // nested metadata exposed as DataObject
                    return wrapped.value;
                }
            // Else go to default
            default:
                return DataviewService.getDataviewAPI().value.toString(wrapped.value);
        }
    }

    private parseToNumber(wrapped: WrappedLiteral): number {
        if (wrapped.type === 'number') {
            return wrapped.value;
        } else {
            const adjustedValue = DataviewService.getDataviewAPI().value.toString(wrapped.value);
            return Number(adjustedValue);
        }
    }

    private parseToBoolean(wrapped: WrappedLiteral): boolean {
        if (wrapped.type === 'boolean') {
            return wrapped.value;
        } else {
            const adjustedValue = DataviewService.getDataviewAPI().value.toString(wrapped.value);
            return adjustedValue === 'true';
        }
    }

    private parseToEnableSorting(wrapped: WrappedLiteral, localSettings: LocalSettings, isInline: boolean): string {
        let auxMarkdown = '';
        switch (wrapped.type) {
            case 'link':
                auxMarkdown = `${wrapped.value.fileName()}|${wrapped.value.path}`;
                break;
            case 'object':
            case 'date':
                if (DateTime.isDateTime(wrapped.value)) {
                    auxMarkdown = wrapped.value.toMillis().toString();
                } else {
                    auxMarkdown = JSON.stringify(wrapped.value);
                }
                break;
            // By default. Use markdown parser
            default:
                auxMarkdown = this.parseToMarkdown(wrapped, localSettings, isInline);
        }
        return auxMarkdown;
    }

    private parseToMarkdown(wrapped: WrappedLiteral, localSettings: LocalSettings, isInline: boolean): string {
        let auxMarkdown = '';
        switch (wrapped.type) {
            case 'boolean':
            case 'number':
                auxMarkdown = wrapped.value.toString();
                break;
            case 'array':
                auxMarkdown = wrapped.value
                    .map(v => this.parseToMarkdown(DataviewService.getDataviewAPI().value.wrapValue(v), localSettings, isInline))
                    .join(', ');
                break;
            case 'link':
                auxMarkdown = wrapped.value.markdown();
                break;
            case 'date':
                if (wrapped.value.hour === 0 && wrapped.value.minute === 0 && wrapped.value.second === 0) {
                    // Parse date
                    auxMarkdown = wrapped.value.toFormat(localSettings.date_format);
                } else {
                    // Parse datetime
                    auxMarkdown = wrapped.value.toFormat(localSettings.datetime_format);
                }
                break;
            case 'object':
                if (DateTime.isDateTime(wrapped.value)) {
                    auxMarkdown = this.parseToMarkdown({ type: 'date', value: wrapped.value }, localSettings, isInline);
                } else {
                    auxMarkdown = JSON.stringify(wrapped.value);
                }
                break;
            default:
                auxMarkdown = wrapped.value?.toString().trim();
        }
        // Check possible markdown breakers
        return this.handleYamlBreaker(auxMarkdown, localSettings, isInline);
    }

    private parseToOptionsArray(wrapped: WrappedLiteral): Literal {
        if (wrapped.type !== 'array') {
            return wrapped.value.toString().split(",").map(s => s.toString().trim());
        }
        return wrapped.value.map(v => DataviewService.getDataviewAPI().value.toString(v));
    }

    private handleYamlBreaker(value: string, localSettings: LocalSettings, isInline?: boolean): string {
        // Do nothing if is inline
        if (isInline) {
            return value;
        }

        // Remove a possible already existing quote wrapper
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
        }

        // Check possible markdown breakers of the yaml
        if (MarkdownBreakerRules.INIT_CHARS.some(c => value.startsWith(c)) ||
            MarkdownBreakerRules.BETWEEN_CHARS.some(rule => value.includes(rule)) ||
            MarkdownBreakerRules.UNIQUE_CHARS.some(c => value === c) ||
            localSettings.frontmatter_quote_wrap) {
            value = value.replaceAll(`\\`, ``);
            value = value.replaceAll(`"`, `\\"`);
            return `"${value}"`;
        }

        return value;
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