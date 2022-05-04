import Obsidian, { Workspace, Vault, MetadataCache, FileManager, UserEvent } from "obsidian";

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