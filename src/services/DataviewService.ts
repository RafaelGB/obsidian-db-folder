import { Notice } from "obsidian";
import { DataviewApi, getAPI, isPluginEnabled } from "obsidian-dataview";
import { Literal, WrappedLiteral } from "obsidian-dataview/lib/data-model/value";
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

    wrapLiteral(literal: Literal): WrappedLiteral {
        return this.getDataviewAPI().value.wrapValue(literal);
    }

    isTruthy(literal: Literal): boolean {
        return this.getDataviewAPI().value.isTruthy(literal?.toString());
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
}

export const DataviewService = DataviewProxy.getInstance();