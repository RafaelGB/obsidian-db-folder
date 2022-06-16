import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import ArrowLeftIcon from "components/img/ArrowLeft";
import ArrowRightIcon from "components/img/ArrowRight";
import React from "react";
import { ActionTypes } from "helpers/Constants";
import { Column } from "react-table";
import { getColumnWidthStyle } from "components/styles/ColumnWidthStyle";

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
    const { hooks } = this.globalHeaderActionResponse;
    const { column, tableData } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    const newButtons: any[] = [];
    newButtons.push(
      {
        onClick: (e: any) => {
          tableData.dispatch({
            type: ActionTypes.ADD_COLUMN_TO_LEFT,
            columnId: column.id,
            focus: false,
            columnInfo: this.adjustWidthOfTheColumnsWhenAdd(
              column.position - 1
            ),
          });
          hooks.setExpanded(false);
        },
        icon: <ArrowLeftIcon />,
        label: "Insert left",
      },
      {
        onClick: (e: any) => {
          tableData.dispatch({
            type: ActionTypes.ADD_COLUMN_TO_RIGHT,
            columnId: column.id,
            focus: false,
            columnInfo: this.adjustWidthOfTheColumnsWhenAdd(
              column.position + 1
            ),
          });
          hooks.setExpanded(false);
        },
        icon: <ArrowRightIcon />,
        label: "Insert right",
      }
    );
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
