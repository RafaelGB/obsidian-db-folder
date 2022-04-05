import DBFolderPlugin from 'main';

import {
    HoverParent,
    HoverPopover,
    Menu,
    TFile,
    TextFileView,
    WorkspaceLeaf,
  } from 'obsidian';

export const databaseViewType = 'database-view';
export const databaseIcon = 'blocks';

export class DatabaseView extends TextFileView implements HoverParent {
    plugin: DBFolderPlugin;
    hoverPopover: HoverPopover | null;
    
    constructor(leaf: WorkspaceLeaf, plugin: DBFolderPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    /**
     * Unparse the database file, and return the resulting text.
     * @returns 
     */
    getViewData(): string {
        return this.data;
    }

    setViewData(data: string, clear: boolean): void {
        // TODO
        throw new Error('Method not implemented.');
    }

    getViewType(): string {
        return databaseViewType;
    }

    clear(): void {
        /*
        Obsidian *only* calls this after unloading a file, before loading the next.
        Specifically, from onUnloadFile, which calls save(true), and then optionally
        calls clear, if and only if this.file is still non-empty.  That means that
        in this function, this.file is still the *old* file, so we should not do
        anything here that might try to use the file (including its path), so we
        should avoid doing anything that refreshes the display.  (Since that could
        use the file, and would also flash an empty pane during navigation, depending
        on how long the next file load takes.)
        Given all that, it makes more sense to clean up our state from onLoadFile, as
        following a clear there are only two possible states: a successful onLoadFile
        updates our full state via setViewData(), or else it aborts with an error
        first.  So as long as setViewData() and the error handler for onLoadFile()
        fully reset the state (to a valid load state or a valid error state),
        there's nothing to do in this method.  (We can't omit it, since it's
        abstract.)
        */
    }
}