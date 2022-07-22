import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import TrashIcon from "components/img/Trash";
import React from "react";
import { ActionTypes } from "helpers/Constants";
import { TableColumn } from "cdm/FolderModel";

export default class RemoveColumnHandlerAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    const column = this.globalHeaderActionResponse.headerMenuProps.headerProps
      .column.columnDef as TableColumn;
    if (!column.isMetadata) {
      this.removeColumnButton();
    }
    return this.goNext(this.globalHeaderActionResponse);
  }

  /**
   * Add sort buttons to the column header. Global header action response is updated.
   */
  private removeColumnButton(): void {
    const { hooks } = this.globalHeaderActionResponse;
    const { column, table } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    const newButtons: any[] = [];
    newButtons.push({
      onClick: (e: any) => {
        (table.options.meta as any).dispatch({
          type: ActionTypes.DELETE_COLUMN,
          columnId: column.id,
          key: hooks.keyState,
        });
        hooks.setExpanded(false);
      },
      icon: <TrashIcon />,
      label: "Delete",
    });
    this.globalHeaderActionResponse.buttons.push(...newButtons);
  }
}
