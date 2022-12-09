import { Row } from "@tanstack/react-table";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { ColumnsState, DataState } from "cdm/TableStateInterface";
import { TextAreaModal } from "components/modals/TextAreaModal";
import { FooterType, InputType } from "helpers/Constants";
import { t } from "lang/helpers";
import { Menu, Notice, TFile } from "obsidian";
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

/**
 * Generates a menu for the footer options
 * @param event 
 * @param tableColumn 
 * @param columnActions 
 * @param footerType 
 * @param setFooterType 
 */
export function showFooterMenu(
    event: MouseEvent,
    tableColumn: TableColumn,
    columnActions: ColumnsState["actions"],
    footerType: string,
    setFooterType: Dispatch<SetStateAction<string>>) {
    const footerMenu = new Menu();

    const handleFooterOption = (type: string, formula?: string) => () => {
        if (footerType !== type || formula) {
            columnActions.alterColumnConfig(tableColumn, {
                footer_type: type,
                footer_formula: formula || ""
            });
            setFooterType(type);
        }
    };

    const handleFormulaOption = async () => {
        const prompt_filename = new TextAreaModal("Footer formula", tableColumn.config.footer_formula)
            .setPlaceholder("Enter a formula...");
        await prompt_filename.openAndGetValue(
            (value) => {
                handleFooterOption(FooterType.FORMULA, value)();
            },
            () => { new Notice("Formula edition cancelled") });
    };

    footerMenu.addItem((item) => item
        .setTitle(t("footer_menu_none"))
        .onClick(handleFooterOption(FooterType.NONE)));
    footerMenu.addItem((item) => item
        .setTitle(t("footer_menu_count_unique"))
        .onClick(handleFooterOption(FooterType.COUNT_UNIQUE)));
    footerMenu.addItem((item) => item
        .setTitle(t("footer_menu_count_empty"))
        .onClick(handleFooterOption(FooterType.COUNT_EMPTY)));
    footerMenu.addItem((item) => item
        .setTitle(t("footer_menu_percent_empty"))
        .onClick(handleFooterOption(FooterType.PERCENT_EMPTY)));
    footerMenu.addItem((item) => item
        .setTitle(t("footer_menu_count_filled"))
        .onClick(handleFooterOption(FooterType.COUNT_FILLED)));
    footerMenu.addItem((item) => item
        .setTitle(t("footer_menu_percent_filled"))
        .onClick(handleFooterOption(FooterType.PERCENT_FILLED)));
    // Custom footer menu im function of the input type
    switch (tableColumn.input) {
        case InputType.NUMBER:
            footerMenu.addItem((item) => item
                .setTitle(t("footer_menu_sum"))
                .onClick(handleFooterOption(FooterType.SUM)));
            footerMenu.addItem((item) => item
                .setTitle(t("footer_menu_min"))
                .onClick(handleFooterOption(FooterType.MIN)));
            footerMenu.addItem((item) => item
                .setTitle(t("footer_menu_max"))
                .onClick(handleFooterOption(FooterType.MAX)));
            break;
        case InputType.CALENDAR:
        case InputType.CALENDAR_TIME:
            footerMenu.addItem((item) => item
                .setTitle(t("footer_menu_earliest_date"))
                .onClick(handleFooterOption(FooterType.EARLIEST_DATE)));
            footerMenu.addItem((item) => item
                .setTitle(t("footer_menu_latest_date"))
                .onClick(handleFooterOption(FooterType.LATEST_DATE)));
            footerMenu.addItem((item) => item
                .setTitle(t("footer_menu_count_range_date"))
                .onClick(handleFooterOption(FooterType.RANGE_DATE)));
            break;
        default:
        // Do nothing
    }
    // Create your own footer function
    footerMenu.addItem((item) => item
        .setTitle(t("footer_menu_formula"))
        .onClick(handleFormulaOption));

    // Show the menu
    footerMenu.showAtMouseEvent(event);
}