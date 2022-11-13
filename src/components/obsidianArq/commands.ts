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
export function showFileMenu(file: TFile, event: MouseEvent, removeRow: () => void, rewriteFileOfRow: () => void) {
    const fileMenu = new Menu();
    fileMenu.addItem((item) => item
        .setTitle("Rename")
        .setIcon("pencil")
        .onClick(rewriteFileOfRow));
    fileMenu.addItem((item) => item
        .setTitle("Delete")
        .setIcon("trash")
        .onClick(removeRow));
    fileMenu.addSeparator();
    app.workspace.trigger("file-menu", fileMenu, file, null, app.workspace.getMostRecentLeaf());
    fileMenu.showAtMouseEvent(event);
}