import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { generateSortedColumns } from "components/behavior/SortingColumns";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import CrossIcon from "components/img/CrossIcon";
import ArrowUpIcon from "components/img/ArrowUp";
import ArrowDownIcon from "components/img/ArrowDown";
import React from "react";
import { ActionTypes, DataTypes } from "helpers/Constants";

export class SortHandlerAction extends AbstractHeaderAction {
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    const { column } = headerActionResponse;
    switch (column.dataType) {
      case DataTypes.TAGS:
      case DataTypes.TASK:
        // DO NOTHING
        break;
      default:
        headerActionResponse = this.addSortButtons(headerActionResponse);
    }
    return headerActionResponse;
  }
  private addSortButtons(headerActionResponse: HeaderActionResponse) {
    const { column, initialState, hooks } = headerActionResponse;
    const sortButtons: any[] = [];
    sortButtons.push(
      {
        onClick: (e: any) => {
          const sortArray = generateSortedColumns(initialState, column, false);
          // Update state
          initialState.dispatch({
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
          const sortArray = generateSortedColumns(initialState, column, true);
          // Update state
          initialState.dispatch({
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
    headerActionResponse.buttons.push(...sortButtons);
    return headerActionResponse;
  }
}
