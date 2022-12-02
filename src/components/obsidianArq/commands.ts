import { Row } from "@tanstack/react-table";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { DataState } from "cdm/TableStateInterface";
import { Menu, TFile } from "obsidian";

/**
 * entry arguments for the command <br/>
 * on(
 *      name: 'file-menu', 
 *      callback: (
 *          menu: Menu, 
 *          file: TAbstractFile, 
 *          source: string, 
 *          leaf?: WorkspaceLeaf
 *      ) => any, ctx?: any
 *   ): EventRef;
 * @param file
 * @param position
 */
export function showFileMenu(file: TFile, event: MouseEvent, row: Row<RowDataType>, dataActions: DataState["actions"]) {
    const fileMenu = new Menu();

    const handleDeleteRow = async () => {
        dataActions.removeRow(row.original);
    };

    const handleRenameRow = async () => {
        dataActions.renameFile(row.index);
    };

    const handleOpenFile = async () => {
        await app.workspace.getLeaf().openFile(row.original.__note__.getFile());
    };

    fileMenu.addItem((item) => item
        .setTitle("Open")
        .setIcon("link")
        .onClick(handleOpenFile));
    fileMenu.addItem((item) => item
        .setTitle("Rename")
        .setIcon("pencil")
        .onClick(handleRenameRow));
    fileMenu.addItem((item) => item
        .setTitle("Delete")
        .setIcon("trash")
        .onClick(handleDeleteRow));
    fileMenu.addSeparator();
    app.workspace.trigger("file-menu", fileMenu, file, null, app.workspace.getMostRecentLeaf());
    fileMenu.showAtMouseEvent(event);
}


export function showFooterMenu(event: MouseEvent, tableColumn: TableColumn) {
    const footerMenu = new Menu();
    // TODO: translate , icon & callback
    footerMenu.addItem((item) => item
        .setTitle("None")
        .setIcon("pencil")
        .onClick(() => { }));
    // TODO: translate , icon & callback
    footerMenu.addItem((item) => item
        .setTitle("Sum")
        .setIcon("pencil")
        .onClick(() => { }));
    // TODO: translate , icon & callback
    footerMenu.addItem((item) => item
        .setTitle("Average")
        .setIcon("trash")
        .onClick(() => { }));
    footerMenu.showAtMouseEvent(event);
}