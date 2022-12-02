import { Row } from "@tanstack/react-table";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { ColumnsState, DataState } from "cdm/TableStateInterface";
import { FooterType, InputType } from "helpers/Constants";
import { t } from "lang/helpers";
import { Menu, TFile } from "obsidian";
import { Dispatch, SetStateAction } from "react";

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


export function showFooterMenu(
    event: MouseEvent,
    tableColumn: TableColumn,
    columnActions: ColumnsState["actions"],
    footerType: string,
    setFooterType: Dispatch<SetStateAction<string>>) {
    const footerMenu = new Menu();

    const handleFooterOption = (type: string, formula?: string) => () => {
        if (footerType !== type) {
            columnActions.alterColumnConfig(tableColumn, {
                footer_type: type,
                footer_formula: formula || ""
            })
            setFooterType(type);
        }
    };
    // TODO: icon 
    footerMenu.addItem((item) => item
        .setTitle(t("footer_menu_none"))
        .setIcon("pencil")
        .onClick(handleFooterOption(FooterType.NONE)));
    // TODO:  icon 
    footerMenu.addItem((item) => item
        .setTitle(t("footer_menu_count_unique"))
        .setIcon("pencil")
        .onClick(handleFooterOption(FooterType.COUNT_UNIQUE)));

    // Custom footer menu
    switch (tableColumn.input) {
        case InputType.NUMBER:
            // TODO:  icon 
            footerMenu.addItem((item) => item
                .setTitle(t("footer_menu_count_empty"))
                .setIcon("pencil")
                .onClick(handleFooterOption(FooterType.COUNT_EMPTY)));
            // TODO:  icon
            footerMenu.addItem((item) => item
                .setTitle(t("footer_menu_count_filled"))
                .setIcon("pencil")
                .onClick(handleFooterOption(FooterType.COUNT_FILLED)));
            // TODO:  icon 
            footerMenu.addItem((item) => item
                .setTitle(t("footer_menu_sum"))
                .setIcon("pencil")
                .onClick(handleFooterOption(FooterType.SUM)));
            break;
        default:
        // Do nothing
    }

    footerMenu.showAtMouseEvent(event);
}