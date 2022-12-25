import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import ArrowLeftIcon from "components/img/ArrowLeft";
import ArrowRightIcon from "components/img/ArrowRight";
import React from "react";
import { TableColumn } from "cdm/FolderModel";
import headerButtonComponent from "components/headerActions/HeaderButtonComponent";
import { t } from "lang/helpers";

export default class AddColumnHandlerAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addColumnButtons();
    return this.goNext(this.globalHeaderActionResponse);
  }

  /**
   * Add sort buttons to the column header. Global header action response is updated.
   */
  private addColumnButtons(): void {
    const newButtons: any[] = [];
    newButtons.push(addColumnToLeftButton(this.globalHeaderActionResponse));
    newButtons.push(addColumnToRightButton(this.globalHeaderActionResponse));
    this.globalHeaderActionResponse.buttons.push(...newButtons);
  }
}

function addColumnToRightButton(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { table } = headerActionResponse.headerMenuProps.headerProps;
  const column = headerActionResponse.headerMenuProps.headerProps.column
    .columnDef as TableColumn;

  const columnActions = table.options.meta.tableState.columns(
    (state) => state.actions
  );

  const addColumnToRightOnClick = async () => {
    columnActions.addToRight(column);
    hooks.setMenuEl(null);
  };
  return headerButtonComponent({
    onClick: addColumnToRightOnClick,
    icon: <ArrowRightIcon />,
    label: t("header_menu_insert_column_right"),
  });
}

function addColumnToLeftButton(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { table } = headerActionResponse.headerMenuProps.headerProps;
  const column = headerActionResponse.headerMenuProps.headerProps.column
    .columnDef as TableColumn;
  const columnActions = table.options.meta.tableState.columns(
    (state) => state.actions
  );

  const addColumnToLeftOnClick = async () => {
    columnActions.addToLeft(column);
    hooks.setMenuEl(null);
  };

  return headerButtonComponent({
    onClick: addColumnToLeftOnClick,
    icon: <ArrowLeftIcon />,
    label: t("header_menu_insert_column_left"),
  });
}
