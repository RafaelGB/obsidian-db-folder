import { DEFAULT_SETTINGS, InputType, ROLLUP_ACTIONS } from "helpers/Constants";
import { Link, Literal } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { LOGGER } from "services/Logger";
import { ParseService } from "services/ParseService";

class Rollup {
    private pages: Record<string, Literal>[];
    private action: string;
    private key: string;

    static generatePages(relation: Link[]): Record<string, Literal>[] {
        return relation.map((link) =>
            DataviewService.getDataviewAPI().page(link.path)
        );
    }

    constructor(relation: Link[], action?: string, key?: string) {
        const consultedLinks = Rollup.generatePages(relation);
        this.pages = consultedLinks;
        this.action = action;
        this.key = key;
    }

    public dispatch(): string {
        let result = "";
        switch (this.action) {
            case ROLLUP_ACTIONS.SUM:
                result = this.sum();
                break;
            case ROLLUP_ACTIONS.COUNT_ALL:
                result = this.countAll();
                break;
            case ROLLUP_ACTIONS.ORIGINAL_VALUE:
                result = this.originalValue();
                break;
            default:
                // No valid action found
                LOGGER.warn(`No valid action found for rollup: ${this.action}`);
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
    private sum(): string {
        // Check if key is not truthy, return empty string
        if (!this.key) {
            return "";
        }
        let sum = 0;
        this.pages.forEach((page) => {
            if (page[this.key]) {
                sum += Number(page[this.key]);
            }
        });
        return sum.toString();
    }

    /**
     * Obtains the number of pages of the relation with the key informed
     * @returns 
     */
    private countAll(): string {
        return this.pages.filter((page) => page[this.key]).length.toString();
    }

    /**
     * Returns the original value map of the pages with the key informed
     * @returns 
     */
    private originalValue(): string {
        // TODO use local settings of the table instead of default settings
        return this.pages
            .filter((page) => page[this.key])
            .map((page) => ParseService.parseLiteral(page[this.key], InputType.MARKDOWN, DEFAULT_SETTINGS.local_settings)).join(", ");
    }

}

export default Rollup;