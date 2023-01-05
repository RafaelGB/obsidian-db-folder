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
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import React from "react";
import { createRoot } from "react-dom/client";
import { Notice } from "obsidian";
import { AtomicFilter } from "cdm/SettingsModel";
import Grid from "@mui/material/Grid";
import { randomColor } from "helpers/Colors";
import { t } from "lang/helpers";

export class AddNewFilterHandler extends AbstractHandlerClass<FiltersModalHandlerResponse> {
  settingTitle: string = t("filters_modal_add_single_filter");
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
      new Notice(t("filters_modal_add_group_filter_error_no_columns"), 3000);
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
      new Notice(t("filters_modal_add_group_filter_error_no_columns"), 3000);
      return;
    }

    const alteredFilterState = { ...configInfo.getFilters() };

    const mockAtomicFilter: AtomicFilter = {
      field: possibleColumns[0],
      operator: OperatorFilter.CONTAINS[0],
      value: "",
    };

    alteredFilterState.conditions.push({
      disabled: false,
      condition: ConditionFiltersOptions.AND,
      filters: [mockAtomicFilter],
      color: randomColor(),
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
          {t("filters_modal_add_single_filter")}
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
          {t("filters_modal_add_group_filter")}
        </Button>
      </Grid>
    </Grid>
  );
};
