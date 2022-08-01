import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import ArrowLeftIcon from "components/img/ArrowLeft";
import ArrowRightIcon from "components/img/ArrowRight";
import React from "react";
import { ActionTypes } from "helpers/Constants";
import { TableColumn } from "cdm/FolderModel";
import headerButtonComponent from "components/headerActions/HeaderButtonComponent";

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

/**
 * Adjust width of the columns when add a new column.
 * @param wantedPosition
 * @returns
 */
function generateNewColumnInfo(
  wantedPosition: number,
  columns: TableColumn[],
  shadowColumns: TableColumn[]
) {
  let columnNumber = columns.length - shadowColumns.length;
  // Check if column name already exists
  while (columns.find((o: any) => o.id === `newColumn${columnNumber}`)) {
    columnNumber++;
  }
  const columnId = `newColumn${columnNumber}`;
  const columnLabel = `New Column ${columnNumber}`;
  return { name: columnId, position: wantedPosition, label: columnLabel };
}

function addColumnToRightButton(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { table } = headerActionResponse.headerMenuProps.headerProps;
  const column = headerActionResponse.headerMenuProps.headerProps.column
    .columnDef as TableColumn;

  const [columns, shadowColumns] = table.options.meta.tableState.columns(
    (state) => [state.columns, state.shadowColumns]
  );

  const addColumnToRightOnClick = (e: any) => {
    table.options.meta.dispatch({
      type: ActionTypes.ADD_COLUMN_TO_RIGHT,
      columnId: column.id,
      focus: false,
      columnInfo: generateNewColumnInfo(
        column.position + 1,
        columns,
        shadowColumns
      ),
    });
    hooks.setExpanded(false);
  };
  return headerButtonComponent({
    onClick: addColumnToRightOnClick,
    icon: <ArrowRightIcon />,
    label: "Insert right",
  });
}

function addColumnToLeftButton(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { table } = headerActionResponse.headerMenuProps.headerProps;
  const column = headerActionResponse.headerMenuProps.headerProps.column
    .columnDef as TableColumn;
  const addToLeft = table.options.meta.tableState.columns(
    (state) => state.addToLeft
  );
  const addColumnToLeftOnClick = (e: any) => {
    addToLeft(column);
    hooks.setExpanded(false);
  };
  return headerButtonComponent({
    onClick: addColumnToLeftOnClick,
    icon: <ArrowLeftIcon />,
    label: "Insert left",
  });
}
