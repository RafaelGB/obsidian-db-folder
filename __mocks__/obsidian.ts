import { Workspace, Vault, MetadataCache, FileManager, UserEvent } from "obsidian";
import { parseYamlMock } from "../src/mock/mockObsidianUtils"

export class App {

    /** @public */
    workspace: Workspace;

    /** @public */
    vault: Vault;

    /** @public */
    metadataCache: MetadataCache;

    /** @public */
    fileManager: FileManager;

    /**
     * The last known user interaction event, to help commands find out what modifier keys are pressed.
     * @public
     */
    lastEvent: UserEvent | null;
}

/**
 * @public
 */
export class Modal {
    /**
     * @public
     */
    constructor(app: App) { }
}

export class Notice {
    constructor() { }
}

export function parseYaml(yaml: string): any {
    return parseYamlMock(1);
}