import { Link, Literal } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { LOGGER } from "services/Logger";

class Rollup {
    private pages: Record<string, Literal>[];
    private action: string;
    private key: string;

    constructor(relation: Link[], action: string, key: string) {
        const consultedLinks = relation.map((link) =>
            DataviewService.getDataviewAPI().page(link.path)
        );
        this.pages = consultedLinks;
        this.action = action;
        this.key = key;
    }
    public dispatch(): string {
        switch (this.action) {
            case "sum":
                return this.sum();
            default:
                // No valid action found
                LOGGER.warn(`No valid action found for rollup: ${this.action}`);
                return "";
        }
    }

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

}

export default Rollup;