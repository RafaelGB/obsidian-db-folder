import { InputType, getOperatorFilterValue, MarkdownBreakerRules, OperatorFilter } from "helpers/Constants";
import { Notice } from "obsidian";
import { DataviewApi, getAPI, isPluginEnabled } from "obsidian-dataview";
import { Literal, WrappedLiteral } from "obsidian-dataview/lib/data-model/value";
import { DateTime } from "luxon";
import { LOGGER } from "services/Logger";
import { FilterCondition, LocalSettings } from "cdm/SettingsModel";
class DataviewProxy {

    private static instance: DataviewProxy;
    /**
     * Check if dataview plugin is installed
     * @returns true if installed, false otherwise
     * @throws Error if plugin is not installed
     */
    getDataviewAPI(): DataviewApi {
        if (isPluginEnabled(app)) {
            return getAPI(app);
        } else {
            new Notice(`Dataview plugin is not installed. Please install it to load Databases.`);
            throw new Error('Dataview plugin is not installed');
        }
    }

    filter(condition: FilterCondition[], p: Record<string, Literal>, ddbbConfig: LocalSettings): boolean {
        if (!condition || condition.length === 0) return true;
        for (const c of condition) {
            const filterableValue = this.parseLiteral(p[c.field], InputType.MARKDOWN, ddbbConfig);
            switch (getOperatorFilterValue(c.operator)) {
                case OperatorFilter.IS_EMPTY[1]:
                    if (filterableValue !== '') {
                        return false;
                    }
                    break;
                case OperatorFilter.IS_NOT_EMPTY[1]:
                    if (filterableValue === '') {
                        return false;
                    }
                    break;
                case OperatorFilter.EQUAL[1]:
                    if (filterableValue !== c.value) return false;
                    break;
                case OperatorFilter.NOT_EQUAL[1]:
                    if (filterableValue === c.value) return false;
                    break;
                case OperatorFilter.GREATER_THAN[1]:
                    if (filterableValue <= c.value) return false;
                    break;
                case OperatorFilter.LESS_THAN[1]:
                    if (filterableValue >= c.value) return false;
                    break;
                case OperatorFilter.GREATER_THAN_OR_EQUAL[1]:
                    if (filterableValue < c.value) return false;
                    break;
                case OperatorFilter.LESS_THAN_OR_EQUAL[1]:
                    if (filterableValue > c.value) return false;
                    break;
                case OperatorFilter.CONTAINS[1]:
                    if (!filterableValue.toString().includes(c.value)) return false;
                    break;
                case OperatorFilter.STARTS_WITH[1]:
                    if (!filterableValue.toString().startsWith(c.value)) return false;
                    break;
                case OperatorFilter.ENDS_WITH[1]:
                    if (!filterableValue.toString().endsWith(c.value)) return false;
                    break;
                default:
                    throw new Error(`Unknown operator ${c.operator}`);

            }
        }
        return true;
    }

    wrapLiteral(literal: Literal): WrappedLiteral {
        return this.getDataviewAPI().value.wrapValue(literal);
    }

    isTruthy(literal: Literal): boolean {
        return this.getDataviewAPI().value.isTruthy(literal?.toString());
    }

    parseLiteral(literal: Literal, dataTypeDst: string, localSettings: LocalSettings, isInline?: boolean): Literal {
        let parsedLiteral: Literal = literal;
        if (!this.isTruthy(literal?.toString())) {
            return "";
        }
        literal = this.parseDataArray(literal);
        const wrapped = this.wrapLiteral(literal);
        LOGGER.debug(`=>parseLiteral: type ${wrapped
            .type} to ${dataTypeDst}`);
        // Check empty or undefined literals
        switch (dataTypeDst) {
            case InputType.TEXT:
                parsedLiteral = this.parseToString(wrapped);
                break;
            case InputType.MARKDOWN:
                parsedLiteral = this.parseToMarkdown(wrapped, localSettings, isInline);
                break;
            case InputType.TAGS:
                parsedLiteral = this.parseToOptionsArray(wrapped);
                break;
            case InputType.CALENDAR:
            case InputType.CALENDAR_TIME:
                parsedLiteral = this.parseToCalendar(wrapped);
                break;
            case InputType.NUMBER:
                parsedLiteral = this.parseToNumber(wrapped);
                break;
            case InputType.CHECKBOX:
                parsedLiteral = this.parseToBoolean(wrapped);
                break;
            case InputType.TASK:
                // Do nothing
                break;
            default:
                parsedLiteral = parsedLiteral = this.parseToString(wrapped);

        }
        LOGGER.debug(`<=parseLiteral`);
        return parsedLiteral;
    }
    /**
     * Check if literal is Proxy DataArray, if so, parse it. If not, return same literal
     * @param literal 
     * @returns 
     */
    parseDataArray(literal: Literal): Literal {
        if ((literal as any).values !== undefined && (literal as any).settings !== undefined) {
            literal = (literal as any).values
        }
        return literal;
    }
    /**
     * Singleton instance
     * @returns {VaultManager}
     */
    public static getInstance(): DataviewProxy {
        if (!this.instance) {
            this.instance = new DataviewProxy();
        }
        return this.instance;
    }

    private parseToCalendar(wrapped: WrappedLiteral): DateTime {
        if (wrapped.type === 'string') {
            const calendarCandidate = DateTime.fromISO(wrapped.value);
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

    private parseToString(wrapped: WrappedLiteral): string {
        if (DateTime.isDateTime(wrapped.value)) {
            LOGGER.debug("adapting DateTime to string...");
            // Values of dataview parse to md friendly strings
            return wrapped.value.toFormat("yyyy-MM-dd");
        } else {
            return this.getDataviewAPI().value.toString(wrapped.value);
        }
    }

    private parseToNumber(wrapped: WrappedLiteral): number {
        if (wrapped.type === 'number') {
            return wrapped.value;
        } else {
            const adjustedValue = this.getDataviewAPI().value.toString(wrapped.value);
            return Number(adjustedValue);
        }
    }

    private parseToBoolean(wrapped: WrappedLiteral): boolean {
        if (wrapped.type === 'boolean') {
            return wrapped.value;
        } else {
            const adjustedValue = this.getDataviewAPI().value.toString(wrapped.value);
            return adjustedValue === 'true' || adjustedValue === '1';
        }
    }

    private parseToMarkdown(wrapped: WrappedLiteral, localSettings: LocalSettings, isInline: boolean): string {
        let auxMarkdown = '';
        switch (wrapped.type) {
            case 'boolean':
            case 'number':
                // Do nothing
                auxMarkdown = wrapped.value.toString();
                break;
            case 'array':
                auxMarkdown = wrapped.value
                    .map(v => this.parseToMarkdown(this.getDataviewAPI().value.wrapValue(v), localSettings, isInline))
                    .join(', ');
                break;

            case 'date':
                if (wrapped.value.hour === 0 && wrapped.value.minute === 0 && wrapped.value.second === 0) {
                    // Parse date
                    auxMarkdown = wrapped.value.toFormat("yyyy-MM-dd");
                } else {
                    // Parse datetime
                    auxMarkdown = wrapped.value.toISO()
                    auxMarkdown = this.handleMarkdownBreaker(auxMarkdown, localSettings, isInline);
                }
                break;
            case 'object':
                if (DateTime.isDateTime(wrapped.value)) {
                    return this.parseToMarkdown({ type: 'date', value: wrapped.value }, localSettings, isInline);
                }
            // Else go to default
            default:
                auxMarkdown = this.parseToString(wrapped) as string;
                // Check possible markdown breakers
                auxMarkdown = this.handleMarkdownBreaker(auxMarkdown, localSettings, isInline);
        }
        return auxMarkdown;
    }

    private parseToOptionsArray(wrapped: WrappedLiteral): Literal {
        if (wrapped.type !== 'array') {
            return wrapped.value.toString().split(",").map(s => s.trim());
        }
        return wrapped.value;
    }

    private handleMarkdownBreaker(value: string, localSettings: LocalSettings, isInline?: boolean): string {
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
}

export const DataviewService = DataviewProxy.getInstance();