import { FilterCondition } from "cdm/DatabaseModel";
import { DataTypes, getOperatorFilterValue, OperatorFilter } from "helpers/Constants";
import { Notice } from "obsidian";
import { getAPI, isPluginEnabled } from "obsidian-dataview";
import { Literal, WrappedLiteral } from "obsidian-dataview/lib/data-model/value";
import { DvAPIInterface } from "obsidian-dataview/lib/typings/api";
import { DateTime } from "luxon";
import { LOGGER } from "services/Logger";
class DataviewProxy {

    private static instance: DataviewProxy;
    /**
     * Check if dataview plugin is installed
     * @returns true if installed, false otherwise
     * @throws Error if plugin is not installed
     */
    getDataviewAPI(): DvAPIInterface {
        if (isPluginEnabled(app)) {
            return getAPI(app);
        } else {
            new Notice(`Dataview plugin is not installed. Please install it to load Databases.`);
            throw new Error('Dataview plugin is not installed');
        }
    }

    filter(condition: FilterCondition[], p: any): boolean {
        if (!condition || condition.length === 0) return true;
        for (const c of condition) {
            switch (getOperatorFilterValue(c.operator)) {
                case OperatorFilter.EQUAL:
                    if (p[c.field] !== c.value) return false;
                    break;
                case OperatorFilter.NOT_EQUAL:
                    if (p[c.field] === c.value) return false;
                    break;
                case OperatorFilter.GREATER_THAN:
                    if (p[c.field] <= c.value) return false;
                    break;
                case OperatorFilter.LESS_THAN:
                    if (p[c.field] >= c.value) return false;
                    break;
                case OperatorFilter.GREATER_THAN_OR_EQUAL:
                    if (p[c.field] < c.value) return false;
                    break;
                case OperatorFilter.LESS_THAN_OR_EQUAL:
                    if (p[c.field] > c.value) return false;
                    break;
                case OperatorFilter.CONTAINS:
                    if (p[c.field] !== undefined && !p[c.field].includes(c.value)) return false;
                    break;
                case OperatorFilter.STARTS_WITH:
                    if (p[c.field] !== undefined && !p[c.field].startsWith(c.value)) return false;
                    break;
                case OperatorFilter.ENDS_WITH:
                    if (p[c.field] !== undefined && !p[c.field].endsWith(c.value)) return false;
                    break;
                default:
                    throw new Error(`Unknown operator: ${c.operator}`);
            }
            return true;
        }
    }

    parseLiteral(literal: Literal, dataTypeDst: string): Literal {
        let parsedLiteral: Literal = literal;
        if (!this.getDataviewAPI().value.isTruthy(literal)) {
            return "";
        }

        literal = this.parseDataArray(literal);

        const wrapped = this.getDataviewAPI().value.wrapValue(literal)
        LOGGER.debug(`=>parseLiteral: type ${wrapped
            .type} to ${dataTypeDst}`);
        // Check empty or undefined literals
        switch (dataTypeDst) {
            case DataTypes.TEXT:
                parsedLiteral = this.parseToString(wrapped);
                break;
            case DataTypes.MARKDOWN:
                parsedLiteral = this.parseToMarkdown(wrapped);
                break;
            case DataTypes.TAGS:
                parsedLiteral = this.parseToOptionsArray(wrapped);
                break;
            case DataTypes.CALENDAR:
            case DataTypes.CALENDAR_TIME:
                parsedLiteral = this.parseToCalendar(wrapped);
                break;
            case DataTypes.NUMBER:
            case DataTypes.CHECKBOX:
                parsedLiteral = this.parseToNumber(wrapped);
                break;
            case DataTypes.TASK:
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
        if (DateTime.isDateTime(wrapped.value)) {
            if (wrapped.type === 'string') {
                return DateTime.fromISO(wrapped.value);
            } else {
                return wrapped.value;
            }
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
        const adjustedValue = this.getDataviewAPI().value.toString(wrapped.value);
        return wrapped.type === 'number' ? wrapped.value : Number(adjustedValue);
    }

    private parseToMarkdown(wrapped: WrappedLiteral): string {
        let auxMarkdown = this.parseToString(wrapped) as string;
        if (auxMarkdown.contains(":")) {
            auxMarkdown = `"${auxMarkdown}"`;
        }
        return auxMarkdown;
    }

    private parseToOptionsArray(wrapped: WrappedLiteral): Literal {
        if (wrapped.type !== 'array') {
            return [wrapped.value.toString()];
        }
        return wrapped.value;
    }
}

export const DataviewService = DataviewProxy.getInstance();