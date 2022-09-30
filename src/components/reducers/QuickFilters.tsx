import Chip from "@mui/material/Chip";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import { DataviewFiltersProps } from "cdm/ComponentsModel";
import { FilterGroup, FilterGroupCondition } from "cdm/SettingsModel";
import React, { useMemo, useState } from "react";

const QuickFilters = (props: DataviewFiltersProps) => {
  const { table } = props;
  const { tableState, view } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);
  const filters = tableState.configState((state) => state.filters);
  const quickConditions: FilterGroup[] = useMemo(
    () =>
      filters.conditions.filter(
        (condition) => (condition as FilterGroupCondition).condition
      ),
    [filters.conditions]
  );
  return (
    <Stack direction="row" spacing={1}>
      {quickConditions.map((condition, index) => {
        return <Chip size="small" label={`filter-${index}`} />;
      })}
    </Stack>
  );
};

export default QuickFilters;
