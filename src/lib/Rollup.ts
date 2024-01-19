import { LocalSettings } from "cdm/SettingsModel";
import { DEFAULT_SETTINGS, InputType, ROLLUP_ACTIONS } from "helpers/Constants";
import { Link, Literal, SMarkdownPage } from "obsidian-dataview";
import { Db } from "services/CoreService";
import { DataviewService } from "services/DataviewService";
import { LOGGER } from "services/Logger";
import { ParseService } from "services/ParseService";

class Rollup {
    private pages: Record<string, Literal>[];

    /**
     * Obtains the metadata associated to a list of links
     * @param relation 
     * @returns 
     */
    static generatePages(relation: Link[]): Record<string, Literal>[] {
        return relation.map((link) =>
            DataviewService.getDataviewAPI().page(link.path)
        );
    }

    constructor(relation: Link[]) {
        const consultedLinks = Rollup.generatePages(relation);
        this.pages = consultedLinks;
    }

    public dispatch(action: string, key?: string): string {
        if (!action) {
            LOGGER.error("No action informed");
            return "";
        }
        let result = "";
        switch (action) {
            case ROLLUP_ACTIONS.SUM:
                result = this.sum(key).toString();
                break;

            case ROLLUP_ACTIONS.COUNT_ALL:
                result = this.countAll(key).toString();
                break;

            case ROLLUP_ACTIONS.COUNT_UNIQUE:
                result = this.countUnique(key).toString();
                break;

            case ROLLUP_ACTIONS.ORIGINAL_VALUE:
                result = this.originalValue(key);
                break;

            case ROLLUP_ACTIONS.TRUTHY_COUNT:
                result = this.truthyCount(key).toString();
                break;

            case ROLLUP_ACTIONS.FALSY_COUNT:
                result = this.falsyCount(key).toString();
                break;

            case ROLLUP_ACTIONS.PERCENT_EMPTY:
                result = this.percentEmpty(key);
                break;

            case ROLLUP_ACTIONS.PERCENT_FILLED:
                result = this.percentFilled(key);
                break;

            case ROLLUP_ACTIONS.ALL_TASKS:
                result = this.allTasks().toString();
                break;

            case ROLLUP_ACTIONS.TASK_COMPLETED:
                result = this.taskCompleted().toString();
                break;

            case ROLLUP_ACTIONS.TASK_TODO:
                result = this.taskTodo().toString();
                break;

            default:
                // No valid action found
                LOGGER.warn(`No valid action found for rollup: ${action}`);
        }
        return result;
    }

    public getPages(): Record<string, Literal>[] {
        return this.pages;
    }

    /**
     * Iters over the pages and sums the values of the key
     * @returns 
     */
    public sum(key: string): number {
        // Check if key is not truthy, return empty string
        if (!key) {
            return NaN;
        }
        const rawValues = this.rawValues(key);
        return Db.coreFns.numbers.sum(rawValues)
    }

    /**
     * Obtains the number of pages of the relation with the key informed
     * @returns 
     */
    public countAll(key: string): number {
        // Check if key is not truthy, return empty string
        if (!key) {
            return 0;
        }
        return this.rawValues(key).length;
    }

    public countUnique(key: string): number {
        // Check if key is not truthy, return empty string
        if (!key) {
            return 0;
        }
        const uniqueValues = new Set();
        this.rawValues(key).forEach((value) => uniqueValues.add(value));
        return uniqueValues.size;
    }

    /**
     * Returns the original value map of the pages with the key informed
     * @returns 
     */
    public originalValue(key: string, config?: LocalSettings): string {
        // Check if key is not truthy, return empty string
        if (!key) {
            return "";
        }
        const settings = config || DEFAULT_SETTINGS.local_settings;
        return this.rawValues(key)
            .map((value) => ParseService.parseLiteral(
                value,
                InputType.MARKDOWN,
                settings))
            .join(", ");
    }

    public falsyCount(key: string): number {
        // Check if key is not truthy, return empty string
        if (!key) {
            return 0;
        }
        return this.pages.filter((page) => page[key] !== undefined && !page[key]).length;
    }

    public truthyCount(key: string): number {
        // Check if key is not truthy, return empty string
        if (!key) {
            return 0;
        }
        return this.pages.filter((page) => page[key] !== undefined && page[key]).length;
    }

    public percentEmpty(key: string): string {
        // Check if key is not truthy, return empty string
        if (!key) {
            return "";
        }
        const total = this.pages.length;
        const empty = this.pages.filter((page) => page[key] === undefined).length;
        return `${((empty / total) * 100).toFixed(2)}%`;
    }

    public percentFilled(key: string): string {
        // Check if key is not truthy, return empty string
        if (!key) {
            return "";
        }
        const total = this.pages.length;
        const filled = this.pages.filter((page) => page[key] !== undefined).length;
        return `${((filled / total) * 100).toFixed(2)}%`;
    }

    public allTasks(): number {
        return this.pages.map((page: SMarkdownPage) => {
            const file_tasks = page.file.tasks;
            return file_tasks.length
        }).reduce((a, b) => a + b, 0);
    }

    public taskCompleted(): number {
        return this.pages.map((page: SMarkdownPage) => {
            const file_tasks = page.file.tasks;
            return file_tasks.filter((task: any) => task.checked).length
        }).reduce((a, b) => a + b, 0);
    }

    public taskTodo(): number {
        return this.pages.map((page: SMarkdownPage) => {
            const file_tasks = page.file.tasks;
            return file_tasks.filter((task: any) => !task.checked).length
        }).reduce((a, b) => a + b, 0);
    }

    private rawValues(key: string): Literal[] {
        return this.pages.filter((page) => page[key] !== undefined).map((page) => page[key]);
    }
}

export default Rollup;