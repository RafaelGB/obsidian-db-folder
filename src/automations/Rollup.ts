import { LocalSettings } from "cdm/SettingsModel";
import { DEFAULT_SETTINGS, InputType, ROLLUP_ACTIONS } from "helpers/Constants";
import { Link, Literal, SMarkdownPage } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { LOGGER } from "services/Logger";
import { ParseService } from "services/ParseService";

class Rollup {
    private pages: Record<string, Literal>[];

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
                result = this.sum(key);
                break;

            case ROLLUP_ACTIONS.COUNT_ALL:
                result = this.countAll(key);
                break;

            case ROLLUP_ACTIONS.COUNT_UNIQUE:
                result = this.countUnique(key);
                break;

            case ROLLUP_ACTIONS.ORIGINAL_VALUE:
                result = this.originalValue(key);
                break;

            case ROLLUP_ACTIONS.TRUTHY_COUNT:
                result = this.truthyCount(key);
                break;

            case ROLLUP_ACTIONS.FALSY_COUNT:
                result = this.falsyCount(key);
                break;

            case ROLLUP_ACTIONS.PERCENT_EMPTY:
                result = this.percentEmpty(key);
                break;

            case ROLLUP_ACTIONS.PERCENT_FILLED:
                result = this.percentFilled(key);
                break;

            case ROLLUP_ACTIONS.ALL_TASKS:
                result = this.allTasks();
                break;

            case ROLLUP_ACTIONS.TASK_COMPLETED:
                result = this.taskCompleted();
                break;

            case ROLLUP_ACTIONS.TASK_TODO:
                result = this.taskTodo();
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
    public sum(key: string): string {
        // Check if key is not truthy, return empty string
        if (!key) {
            return "";
        }
        let sum = 0;
        this.pages.forEach((page) => {
            if (page[key]) {
                sum += Number(page[key]);
            }
        });
        return sum.toString();
    }

    /**
     * Obtains the number of pages of the relation with the key informed
     * @returns 
     */
    public countAll(key: string): string {
        // Check if key is not truthy, return empty string
        if (!key) {
            return "";
        }
        return this.pages.filter((page) => page[key] !== undefined).length.toString();
    }

    public countUnique(key: string): string {
        // Check if key is not truthy, return empty string
        if (!key) {
            return "";
        }
        const uniqueValues = new Set();
        this.pages
            .filter((page) => page[key] !== undefined)
            .forEach((page) => {
                uniqueValues.add(page[key]);
            });
        return uniqueValues.size.toString();
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
        return this.pages
            .filter((page) => page[key])
            .map((page) => ParseService.parseLiteral(page[key], InputType.MARKDOWN, settings)).join(", ");
    }

    public falsyCount(key: string): string {
        // Check if key is not truthy, return empty string
        if (!key) {
            return "";
        }
        return this.pages.filter((page) => page[key] !== undefined && !page[key]).length.toString();
    }

    public truthyCount(key: string): string {
        // Check if key is not truthy, return empty string
        if (!key) {
            return "";
        }
        return this.pages.filter((page) => page[key] !== undefined && page[key]).length.toString();
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

    public allTasks(): string {
        return this.pages.map((page: SMarkdownPage) => {
            const file_tasks = page.file.tasks;
            return file_tasks.length
        }).reduce((a, b) => a + b, 0).toString();
    }

    public taskCompleted(): string {
        return this.pages.map((page: SMarkdownPage) => {
            const file_tasks = page.file.tasks;
            return file_tasks.filter(task => task.checked).length
        }).reduce((a, b) => a + b, 0).toString();
    }

    public taskTodo(): string {
        return this.pages.map((page: SMarkdownPage) => {
            const file_tasks = page.file.tasks;
            return file_tasks.filter(task => !task.checked).length
        }).reduce((a, b) => a + b, 0).toString();
    }
}

export default Rollup;