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
                    if (!p[c.field].includes(c.value)) return false;
                    break;
                case OperatorFilter.STARTS_WITH:
                    if (!p[c.field].startsWith(c.value)) return false;
                    break;
                case OperatorFilter.ENDS_WITH:
                    if (!p[c.field].endsWith(c.value)) return false;
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

        // Check empty or undefined literals
        switch (dataTypeDst) {
            case DataTypes.CALENDAR:
            case DataTypes.CALENDAR_TIME:
                parsedLiteral = this.parseToCalendar(wrapped);
                break;
            case DataTypes.NUMBER:
                parsedLiteral = wrapped.type === 'number' ? literal : Number(literal);
                break;
            default:

                if (DateTime.isDateTime(wrapped.value)) {
                    // Values of dataview parse to md friendly strings
                    parsedLiteral = wrapped.value.toFormat("yyyy-MM-dd");
                } else {
                    parsedLiteral = this.getDataviewAPI().value.toString(literal);
                }
        }
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

    private parseToCalendar(literal: WrappedLiteral): Literal {
        if (DateTime.isDateTime(literal.value)) {
            if (literal.type === 'string') {
                return DateTime.fromISO(literal.value);
            } else {
                return literal.value;
            }
        } else {
            return null;
        }
    }
}

export const DataviewService = DataviewProxy.getInstance();