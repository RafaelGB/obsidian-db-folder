import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { generateSortedColumns } from "components/behavior/SortingColumns";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import CrossIcon from "components/img/CrossIcon";
import ArrowUpIcon from "components/img/ArrowUp";
import ArrowDownIcon from "components/img/ArrowDown";
import React from "react";
import { ActionTypes, DataTypes } from "helpers/Constants";

export default class SortHandlerAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    const { column } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
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
    const { column, table } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    const sortButtons: any[] = [];
    sortButtons.push(
      {
        onClick: (e: any) => {
          const sortArray = generateSortedColumns(
            table.options.meta as any,
            column,
            false
          );
          // Update state
          (table.options.meta as any).dispatch({
            type: ActionTypes.SET_SORT_BY,
            sortArray: sortArray,
          });
          hooks.setSortBy(sortArray);
          hooks.setExpanded(false);
        },
        icon:
          column.isSorted && !column.isSortedDesc ? (
            <CrossIcon />
          ) : (
            <ArrowUpIcon />
          ),
        label:
          column.isSorted && !column.isSortedDesc
            ? "Remove ascending sort"
            : "Sort ascending",
      },
      {
        onClick: (e: any) => {
          const sortArray = generateSortedColumns(
            table.options.meta as any,
            column,
            true
          );
          // Update state
          (table.options.meta as any).dispatch({
            type: ActionTypes.SET_SORT_BY,
            sortArray: sortArray,
          });
          hooks.setSortBy(sortArray);
          hooks.setExpanded(false);
        },
        icon:
          column.isSorted && column.isSortedDesc ? (
            <CrossIcon />
          ) : (
            <ArrowDownIcon />
          ),
        label:
          column.isSorted && column.isSortedDesc
            ? "Remove descending sort"
            : "Sort descending",
      }
    );
    this.globalHeaderActionResponse.buttons.push(...sortButtons);
  }
}
