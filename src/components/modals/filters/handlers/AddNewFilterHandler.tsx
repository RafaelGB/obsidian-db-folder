import Button from "@mui/material/Button";
import {
  FiltersModalHandlerResponse,
  FiltersModalProps,
} from "cdm/ModalsModel";
import { OperatorFilter, StyleVariables } from "helpers/Constants";
import AddIcon from "@mui/icons-material/Add";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import React from "react";
import { createRoot } from "react-dom/client";
import { Notice } from "obsidian";

export class AddNewFilterHandler extends AbstractHandlerClass<FiltersModalHandlerResponse> {
  settingTitle: string = "Add new filter";
  handle(
    columnHandlerResponse: FiltersModalHandlerResponse
  ): FiltersModalHandlerResponse {
    const { containerEl, filtersModalManager } = columnHandlerResponse;
    createRoot(containerEl.createDiv()).render(
      <NewFiltersForm {...filtersModalManager.props} />
    );
    return this.goNext(columnHandlerResponse);
  }
}

const NewFiltersForm = (props: FiltersModalProps) => {
  const { table, possibleColumns } = props;
  const { tableState } = table.options.meta;
  const configActions = tableState.configState((state) => state.actions);
  const filters = tableState.configState((state) => state.filters);

  const addConditionHandler = () => {
    // Check if there is a condition to add
    if (possibleColumns.length <= 0) {
      new Notice(
        "No columns available yet. Include a field in one of your notes before add a filter",
        3000
      );
      return;
    }

    const alteredFilterState = { ...filters };
    alteredFilterState.conditions.push({
      field: possibleColumns[0],
      operator: OperatorFilter.CONTAINS[0],
      value: "",
    });
    configActions.alterFilters(alteredFilterState);
  };

  return (
    <Button
      size="small"
      key={`Button-Plus-DataviewFilters`}
      variant="outlined"
      startIcon={<AddIcon />}
      style={{
        borderColor: StyleVariables.TEXT_NORMAL,
        color: StyleVariables.TEXT_NORMAL,
      }}
      onClick={addConditionHandler}
    >
      Add filter
    </Button>
  );
};
