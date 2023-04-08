import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { TableFiltersProps } from "cdm/ComponentsModel";
import { FilterGroupCondition } from "cdm/SettingsModel";
import { StyleVariables } from "helpers/Constants";
import React from "react";

const QuickFilters = (props: TableFiltersProps) => {
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

  return filters.conditions.length > 0 ? (
    <Stack direction="row" spacing={1} key="stack-quick-filters">
      {filters.conditions.map((condition, filterIndex) => {
        const { disabled } = condition as FilterGroupCondition;
        if ((condition as FilterGroupCondition).condition) {
          const label = (condition as FilterGroupCondition).label;
          const color = (condition as FilterGroupCondition).color;
          return (
            <div
              onClick={toggleFilterGroupOnClickHandler(filterIndex)}
              key={`quickFilter-div-chip-${filterIndex}`}
            >
              <Chip
                size="small"
                label={label ?? `filter-${filterIndex}`}
                key={`quickFilter-chip-${filterIndex}`}
                sx={{
                  backgroundColor: disabled
                    ? StyleVariables.INTERACTIVE_NORMAL
                    : color,
                  boxShadow: disabled ? StyleVariables.INPUT_SHADOW : "none",
                  borderColor: disabled ? StyleVariables.LINK_COLOR : "none",
                  color: disabled
                    ? StyleVariables.LINK_COLOR
                    : StyleVariables.TEXT_NORMAL,
                  borderRadius: "4px",
                }}
              />
            </div>
          );
        }
      })}
    </Stack>
  ) : null;
};

export default QuickFilters;
