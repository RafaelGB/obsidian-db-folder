import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import React from "react";
import { TableColumn } from "cdm/FolderModel";
import headerButtonComponent from "components/headerActions/HeaderButtonComponent";
import HideIcon from "components/img/HideIcon";

export default class HideColumnHandlerAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(response: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = response;
    this.hideColumnButton();
    return this.goNext(this.globalHeaderActionResponse);
  }

  /**
   * Add sort buttons to the column header. Global header action response is updated.
   */
  private hideColumnButton(): void {
    this.globalHeaderActionResponse.buttons.push(
      hideButton(this.globalHeaderActionResponse)
    );
  }
}
function hideButton(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { column, table } = headerActionResponse.headerMenuProps.headerProps;
  const columnActions = table.options.meta.tableState.columns(
    (store) => store.actions
  );

  const onClick = async () => {
    const currentCol = column.columnDef as TableColumn;
    column.getToggleVisibilityHandler()({ target: { checked: false } });
    columnActions.alterIsHidden(currentCol, true);
    hooks.setMenuEl(null);
  };

  return headerButtonComponent({
    onClick: onClick,
    icon: <HideIcon />,
    label: "Hide",
  });
}
