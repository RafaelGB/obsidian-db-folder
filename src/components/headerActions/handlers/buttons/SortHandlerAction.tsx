import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { generateSortedColumns } from "components/behavior/SortingColumns";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import CrossIcon from "components/img/CrossIcon";
import ArrowUpIcon from "components/img/ArrowUp";
import ArrowDownIcon from "components/img/ArrowDown";
import React from "react";
import { ActionTypes, DataTypes } from "helpers/Constants";
import { TableColumn, TableDataType } from "cdm/FolderModel";

export default class SortHandlerAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    const column = this.globalHeaderActionResponse.headerMenuProps.headerProps
      .column.columnDef as TableColumn;
    switch (column.dataType) {
      case DataTypes.TAGS:
      case DataTypes.TASK:
        // DO NOTHING
        break;
      default:
        this.addSortButtons();
    }
    return this.goNext(this.globalHeaderActionResponse);
  }

  /**
   * add sort buttons to the column header. Global header action response is updated.
   */
  private addSortButtons(): void {
    const { hooks } = this.globalHeaderActionResponse;
    const { table, column } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    const tablecolumn = column.columnDef as TableColumn;
    const sortButtons: any[] = [];
    sortButtons.push(
      {
        onClick: (e: any) => {
          const sortArray = generateSortedColumns(
            table.options.meta as TableDataType,
            tablecolumn,
            false
          );
          console.log(sortArray);
          // Update state
          (table.options.meta as TableDataType).dispatch({
            type: ActionTypes.SET_SORT_BY,
            sortArray: sortArray,
          });
          column.getToggleSortingHandler();

          hooks.setExpanded(false);
        },
        icon:
          tablecolumn.isSorted && !tablecolumn.isSortedDesc ? (
            <CrossIcon />
          ) : (
            <ArrowUpIcon />
          ),
        label:
          tablecolumn.isSorted && !tablecolumn.isSortedDesc
            ? "Remove ascending sort"
            : "Sort ascending",
      },
      {
        onClick: (e: any) => {
          const sortArray = generateSortedColumns(
            table.options.meta as any,
            tablecolumn,
            true
          );
          // Update state
          (table.options.meta as any).dispatch({
            type: ActionTypes.SET_SORT_BY,
            sortArray: sortArray,
          });
          column.getToggleSortingHandler();
          hooks.setExpanded(false);
        },
        icon:
          tablecolumn.isSorted && tablecolumn.isSortedDesc ? (
            <CrossIcon />
          ) : (
            <ArrowDownIcon />
          ),
        label:
          tablecolumn.isSorted && tablecolumn.isSortedDesc
            ? "Remove descending sort"
            : "Sort descending",
      }
    );
    this.globalHeaderActionResponse.buttons.push(...sortButtons);
  }
}
