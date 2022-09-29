import Button from "@mui/material/Button";
import {
  FiltersModalHandlerResponse,
  FiltersModalProps,
} from "cdm/ModalsModel";
import {
  ConditionFiltersOptions,
  OperatorFilter,
  StyleVariables,
} from "helpers/Constants";
import AddIcon from "@mui/icons-material/Add";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import React from "react";
import { createRoot } from "react-dom/client";
import { Notice } from "obsidian";
import { AtomicFilter } from "cdm/SettingsModel";
import Grid from "@mui/material/Grid";

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
  const configInfo = tableState.configState((state) => state.info);

  const addConditionHandler = () => {
    // Check if there is a condition to add
    if (possibleColumns.length <= 0) {
      new Notice(
        "No columns available yet. Include a field in one of your notes before add a filter",
        3000
      );
      return;
    }

    const alteredFilterState = { ...configInfo.getFilters() };
    alteredFilterState.conditions.push({
      field: possibleColumns[0],
      operator: OperatorFilter.CONTAINS[0],
      value: "",
    });
    configActions.alterFilters(alteredFilterState);
  };

  const addGroupConditionHandler = () => {
    // Check if there is a condition to add
    if (possibleColumns.length <= 0) {
      new Notice(
        "No columns available yet. Include a field in one of your notes before add a filter",
        3000
      );
      return;
    }

    const alteredFilterState = { ...configInfo.getFilters() };

    const mockAtomicFilter: AtomicFilter = {
      field: possibleColumns[0],
      operator: OperatorFilter.CONTAINS[0],
      value: "",
    };

    alteredFilterState.conditions.push({
      condition: ConditionFiltersOptions.AND,
      filters: [mockAtomicFilter],
    });
    configActions.alterFilters(alteredFilterState);
  };

  return (
    <Grid
      container
      rowSpacing={0.25}
      columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }}
      key={`Grid-root-add-filters`}
    >
      <Grid item xs="auto" key={`Grid-add-atomic-filter`}>
        <Button
          size="small"
          key={`Button-Plus-DataviewFilters`}
          variant="outlined"
          startIcon={<AddIcon sx={{ color: StyleVariables.TEXT_ACCENT }} />}
          style={{
            borderColor: StyleVariables.TEXT_NORMAL,
            color: StyleVariables.TEXT_NORMAL,
          }}
          onClick={addConditionHandler}
        >
          Add filter
        </Button>
      </Grid>
      <Grid item xs="auto" key={`Grid-add-group-filter`}>
        <Button
          size="small"
          key={`Button-Plus-DataviewFilters`}
          variant="outlined"
          startIcon={
            <CreateNewFolderIcon sx={{ color: StyleVariables.TEXT_ACCENT }} />
          }
          style={{
            borderColor: StyleVariables.TEXT_NORMAL,
            color: StyleVariables.TEXT_NORMAL,
          }}
          onClick={addGroupConditionHandler}
        >
          Add group
        </Button>
      </Grid>
    </Grid>
  );
};
