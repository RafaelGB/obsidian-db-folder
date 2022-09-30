import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { DataviewFiltersProps } from "cdm/ComponentsModel";
import { FilterGroupCondition } from "cdm/SettingsModel";
import { StyleVariables } from "helpers/Constants";
import React from "react";

const QuickFilters = (props: DataviewFiltersProps) => {
  const { table } = props;
  const { tableState } = table.options.meta;
  const configActions = tableState.configState((state) => state.actions);
  const dataActions = tableState.data((state) => state.actions);
  const configInfo = tableState.configState((state) => state.info);
  const columnsInfo = tableState.columns((state) => state.info);
  const filters = tableState.configState((state) => state.filters);
  const toggleFilterGroupOnClickHandler = (filterIndex: number) => () => {
    const alteredFilterState = { ...configInfo.getFilters() };
    const currentValue = filters.conditions[
      filterIndex
    ] as FilterGroupCondition;

    (
      alteredFilterState.conditions[filterIndex] as FilterGroupCondition
    ).disabled = !currentValue.disabled;

    configActions.alterFilters(filters);
    dataActions.dataviewRefresh(
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings(),
      alteredFilterState
    );
  };

  return (
    <Stack direction="row" spacing={1}>
      {filters.conditions.map((condition, filterIndex) => {
        if ((condition as FilterGroupCondition).condition) {
          const label = (condition as FilterGroupCondition).label;
          return (
            <div onClick={toggleFilterGroupOnClickHandler(filterIndex)}>
              <Chip
                size="small"
                label={label ?? `filter-${filterIndex}`}
                sx={{
                  backgroundColor: (condition as FilterGroupCondition).disabled
                    ? StyleVariables.BACKGROUND_SECONDARY
                    : StyleVariables.TEXT_ACCENT,
                  border: `1px solid ${StyleVariables.TEXT_NORMAL}`,
                }}
              />
            </div>
          );
        }
      })}
    </Stack>
  );
};

export default QuickFilters;
