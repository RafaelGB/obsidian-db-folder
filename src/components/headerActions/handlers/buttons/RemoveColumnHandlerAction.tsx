import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import TrashIcon from "components/img/Trash";
import React from "react";
import { ActionTypes } from "helpers/Constants";
import { Column } from "react-table";
import { getColumnWidthStyle } from "components/styles/ColumnWidthStyle";

export default class RemoveColumnHandlerAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    const { column } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
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
    const { column, tableData } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    const newButtons: any[] = [];
    newButtons.push({
      onClick: (e: any) => {
        tableData.dispatch({
          type: ActionTypes.DELETE_COLUMN,
          columnId: column.id,
          key: hooks.keyState,
        });
        hooks.setExpanded(false);
        delete hooks.columnWidthState.widthRecord[column.id];
        hooks.setColumnWidthState(hooks.columnWidthState);
      },
      icon: <TrashIcon />,
      label: "Delete",
    });
    this.globalHeaderActionResponse.buttons.push(...newButtons);
  }

  /**
   * Adjust width of the columns when add a new column.
   * @param wantedPosition
   * @returns
   */
  private adjustWidthOfTheColumnsWhenAdd(wantedPosition: number) {
    const { hooks } = this.globalHeaderActionResponse;
    const { tableData, column, rows } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    let columnNumber =
      tableData.columns.length - tableData.shadowColumns.length;
    // Check if column name already exists
    while (
      this.globalHeaderActionResponse.headerMenuProps.headerProps.allColumns.find(
        (o: Column) => o.id === `newColumn${columnNumber}`
      )
    ) {
      columnNumber++;
    }
    const columnId = `newColumn${columnNumber}`;
    const columnLabel = `New Column ${columnNumber}`;
    hooks.columnWidthState.widthRecord[columnId] = getColumnWidthStyle(
      rows,
      column
    );
    hooks.setColumnWidthState(hooks.columnWidthState);
    return { name: columnId, position: wantedPosition, label: columnLabel };
  }
}
