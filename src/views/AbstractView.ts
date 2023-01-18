import { DataApi } from "api/data-api";
import { UpdaterData, ViewEvents } from "cdm/EmitterModel";
import { InitialType, RowDataType, TableColumn } from "cdm/FolderModel";
import { DatabaseCore, DB_ICONS, EMITTERS_BAR_STATUS, EMITTERS_GROUPS, EMITTERS_SHORTCUT } from "helpers/Constants";
import { Emitter } from "helpers/Emitter";
import DBFolderPlugin from "main";
import { HoverParent, HoverPopover, TextFileView, TFile } from "obsidian";
import { Root } from "react-dom/client";
import DatabaseInfo from "services/DatabaseInfo";

export abstract class CustomView extends TextFileView implements HoverParent {
    plugin: DBFolderPlugin;
    hoverPopover: HoverPopover | null;
    emitter: Emitter<ViewEvents>;
    tableContainer: HTMLDivElement | null = null;
    rootContainer: Root | null = null;
    diskConfig: DatabaseInfo;
    rows: Array<RowDataType>;
    columns: Array<TableColumn>;
    shadowColumns: Array<TableColumn>;
    initial: InitialType;
    formulas: Record<string, unknown>;
    actionButtons: Record<string, HTMLElement> = {};
    dataApi: DataApi;

    /**
     * Define the icon associated with the view
     * @returns 
     */
    getIcon() {
        return DB_ICONS.NAME;
    }

    /**
     * Define the type key associated with the view
     * @returns 
     */
    getViewType(): string {
        return DatabaseCore.FRONTMATTER_KEY;
    }

    /**
     * Called after unloading a file
     */
    clear(): void { }

    /****************************************************************
   *                     KEYBOARD SHORTCUTS
   ****************************************************************/

    goNextPage() {
        this.emitter.emit(EMITTERS_GROUPS.SHORTCUT, EMITTERS_SHORTCUT.GO_NEXT_PAGE);
    }

    goPreviousPage() {
        this.emitter.emit(
            EMITTERS_GROUPS.SHORTCUT,
            EMITTERS_SHORTCUT.GO_PREVIOUS_PAGE
        );
    }

    addNewRow() {
        this.emitter.emit(EMITTERS_GROUPS.SHORTCUT, EMITTERS_SHORTCUT.ADD_NEW_ROW);
    }

    toggleFilters() {
        this.emitter.emit(
            EMITTERS_GROUPS.SHORTCUT,
            EMITTERS_SHORTCUT.TOGGLE_FILTERS
        );
    }

    openFilters() {
        this.emitter.emit(EMITTERS_GROUPS.SHORTCUT, EMITTERS_SHORTCUT.OPEN_FILTERS);
    }

    /****************************************************************
     *                     REACTIVE ACTIONS
     ****************************************************************/
    /**
     * Dataview API router triggered by any file change
     * @param op
     * @param file
     * @param oldPath
     */
    handleExternalMetadataChange(
        op: string,
        file: TFile,
        isActive: boolean,
        oldPath?: string
    ) {
        this.emitter.emit(EMITTERS_GROUPS.UPDATER, {
            op,
            file,
            isActive,
            oldPath,
        } as UpdaterData);
    }

    handleUpdateStatusBar() {
        this.emitter.emit(EMITTERS_GROUPS.BAR_STATUS, EMITTERS_BAR_STATUS.UPDATE);
    }
}