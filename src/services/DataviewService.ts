import { Notice } from "obsidian";
import { DataviewApi, getAPI, isPluginEnabled } from "obsidian-dataview";
import { Literal, WrappedLiteral } from "obsidian-dataview/lib/data-model/value";
class DataviewProxy {

    private static instance: DataviewProxy;
    private indexIsLoaded: boolean = false;

    /**
     * Check if dataview plugin is installed
     * @returns true if installed, false otherwise
     * @throws Error if plugin is not installed
     */
    getDataviewAPI(): DataviewApi {
        if (!this.isDataviewEnabled()) {
            new Notice(`Dataview plugin is not installed. Please install it to load Databases.`);
            throw new Error('Dataview plugin is not installed');
        }
        if (!this.indexIsLoaded) {
            new Notice(`Dataview plugin is not loaded yet. Please wait a few seconds and try again.`);
            throw new Error("Dataview index is not loaded");
        }

        return getAPI(app);
    }

    wrapLiteral(literal: Literal): WrappedLiteral {
        return this.getDataviewAPI().value.wrapValue(literal);
    }

    isTruthy(literal: Literal): boolean {
        return this.getDataviewAPI().value.isTruthy(literal?.toString());
    }

    isDataviewEnabled(): boolean {
        return isPluginEnabled(app);
    }

    isIndexLoaded(): boolean {
        return this.indexIsLoaded;
    }

    setIndexIsLoaded(value: boolean) {
        this.indexIsLoaded = value;
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