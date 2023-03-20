import { ColumnOption } from "cdm/ComponentsModel"; import { RowDataType, TableColumn } from "cdm/FolderModel";
import { DbInfo } from "cdm/TableStateInterface";
import Rollup from "lib/Rollup";
import { Link, Literal } from "obsidian-dataview";
import { AsyncFunction } from "patterns/Objects";
import { LOGGER } from "./Logger";

class FormulaServiceInstance {

    private static instance: FormulaServiceInstance;

    /**
     * Evaluates a formula for the column options
     * @param column 
     * @param db 
     * @returns 
     */
    evalOptionsWith(column: TableColumn, db: {
        [key: string]: unknown;
    }): ColumnOption[] {
        const input = column.config.formula_option_source;
        const dynamicJS = 'return ' + input;
        const func = new Function('column', 'db', dynamicJS);
        const result = func(column, db);
        return this.validateOptions(result) ? result as ColumnOption[] : [];
    }

    private validateOptions(options: unknown): boolean {
        if (options === undefined || options === null) {
            return false;
        }
        if (Array.isArray(options)) {
            return options.every((option) => {
                return (
                    option.value !== undefined &&
                    option.label !== undefined &&
                    option.color !== undefined
                );
            });
        }
        return false;
    }

    /**
     * Evaluates a formula for a column footer
     * @param formula 
     * @param column 
     * @param values 
     * @param db 
     * @returns 
     */
    evalFooterWith(column: TableColumn, values: Literal[], db: {
        [key: string]: unknown;
    }): Literal {
        try {
            const input = column.config.footer_formula;
            const dynamicJS = 'return `' + input + '`';
            const func = new Function('column', 'values', 'db', dynamicJS);
            const result = func(column, values, db);
            if (result === "undefined" || result === "null") {
                return '';
            }
            return result;
        } catch (e) {
            LOGGER.error(`Error evaluating footer formula from column ${column.key}: `, e);
            return "";
        }
    }

    /**
     * Evaluates a formula for a rollup
     * @param input 
     * @param rollupKey 
     * @param relations 
     * @param db 
     * @returns 
     */
    evalRollupWith(input: string, rollupKey: string, relations: Link[], db: {
        [key: string]: unknown;
    }): Literal {
        const dynamicJS = 'return `' + input + '`';
        const func = new Function('relations', 'rollupKey', 'db', dynamicJS);
        const result = func(new Rollup(relations).getPages(), rollupKey, db);
        if (result === "undefined" || result === "null") {
            return '';
        }
        return result;
    }

    /**
     * Evaluates a formula for a row
     * @param input 
     * @param row 
     * @param info 
     * @param db 
     * @returns 
     */
    async evalWith(input: string, row: RowDataType, info: DbInfo, db: {
        [key: string]: unknown;
    }): Promise<Literal> {
        LOGGER.debug(`Evaluating formula from row ${row.__note__.filepath}: `, input);
        const dynamicJS = 'new Promise((resolve) => {resolve(`' + input + '`)})';
        const func = new AsyncFunction('row', 'info', 'db', dynamicJS);
        const result = await func(row, info, db);

        if (result === "undefined" || result === "null") {
            return '';
        }
        return result;
    }

    /**
     * Singleton instance
     * @returns {VaultManager}
     */
    public static getInstance(): FormulaServiceInstance {
        if (!this.instance) {
            this.instance = new FormulaServiceInstance();
        }
        return this.instance;
    }
}

export const FormulaService = FormulaServiceInstance.getInstance();