import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import TrashIcon from "components/img/Trash";
import React from "react";
import { UpdateRowOptions } from "helpers/Constants";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { updateRowFileProxy } from "helpers/VaultManagement";
import headerButtonComponent from "components/headerActions/HeaderButtonComponent";

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
    this.globalHeaderActionResponse.buttons.push(
      removeButton(this.globalHeaderActionResponse)
    );
  }
}
function removeButton(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { column, table } = headerActionResponse.headerMenuProps.headerProps;
  const ddbbConfig = table.options.meta.tableState.configState(
    (store) => store.ddbbConfig
  );
  const columns = table.options.meta.tableState.columns(
    (store) => store.columns
  );
  const [rows, dataActions] = table.options.meta.tableState.data((store) => [
    store.rows,
    store.actions,
  ]);
  const remove = table.options.meta.tableState.columns((store) => store.remove);

  const onClick = (e: any) => {
    if (ddbbConfig.remove_field_when_delete_column) {
      Promise.all(
        rows.map(async (row: RowDataType) => {
          updateRowFileProxy(
            row.__note__.getFile(),
            hooks.keyState,
            undefined, // delete does not need this field
            columns,
            ddbbConfig,
            UpdateRowOptions.REMOVE_COLUMN
          );
        })
      );
    }
    dataActions.removeDataOfColumn(column.columnDef as TableColumn);
    remove(column.columnDef as TableColumn);
    hooks.setExpanded(false);
  };

  return headerButtonComponent({
    onClick: onClick,
    icon: <TrashIcon />,
    label: "Delete",
  });
}
