import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import TrashIcon from "components/img/Trash";
import React from "react";
import { ActionTypes, UpdateRowOptions } from "helpers/Constants";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { updateRowFileProxy } from "helpers/VaultManagement";

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
        const ddbbConfig = table.options.meta.tableState.configState(
          (store) => store.ddbbConfig
        );
        const [rows, removeDataOfColumn] = table.options.meta.tableState.data(
          (store) => [store.rows, store.removeDataOfColumn]
        );
        const remove = table.options.meta.tableState.columns(
          (store) => store.remove
        );
        if (ddbbConfig.remove_field_when_delete_column) {
          Promise.all(
            rows.map(async (row: RowDataType) => {
              updateRowFileProxy(
                row.__note__.getFile(),
                hooks.keyState,
                undefined, // delete does not need this field
                table.options.meta.tableState,
                UpdateRowOptions.REMOVE_COLUMN
              );
            })
          );
        }
        removeDataOfColumn(column.columnDef as TableColumn);
        remove(column.columnDef as TableColumn);
        hooks.setExpanded(false);
      },
      icon: <TrashIcon />,
      label: "Delete",
    });
    this.globalHeaderActionResponse.buttons.push(...newButtons);
  }
}
