import { Menu, Point, TFile } from "obsidian";

/**
 * on(name: 'file-menu', callback: (menu: Menu, file: TAbstractFile, source: string, leaf?: WorkspaceLeaf) => any, ctx?: any): EventRef;
 * @param file 
 * @param position 
 */
export function showFileMenu(file: TFile, event: MouseEvent, removeRow: () => void) {
    const fileMenu = new Menu();
    fileMenu.addItem((item) => item
        .setTitle("Delete")
        .setIcon("trash")
        .onClick(removeRow));
    app.workspace.trigger("file-menu", fileMenu, file, null, app.workspace.getMostRecentLeaf());
    //fileMenu.showAtPosition(position);
    fileMenu.showAtMouseEvent(event);
}