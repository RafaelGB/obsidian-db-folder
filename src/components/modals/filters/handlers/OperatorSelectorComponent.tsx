import { MenuItem } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Table } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { OperatorFilter, StyleVariables } from "helpers/Constants";
import { t } from "lang/helpers";
import React from "react";
import modifyRecursiveFilterGroups from "components/modals/filters/handlers/FiltersHelper";

const OperatorSelectorComponent = (selectorProps: {
  currentOp: string;
  recursiveIndex: number[];
  level: number;
  table: Table<RowDataType>;
}) => {
  const { currentOp, recursiveIndex, level, table } = selectorProps;
  const { tableState } = table.options.meta;
  const [ddbbConfig, configActions] = tableState.configState((state) => [
    state.ddbbConfig,
    state.actions,
  ]);
  const configInfo = tableState.configState((state) => state.info);
  const columns = tableState.columns((state) => state.columns);
  const dataActions = tableState.data((state) => state.actions);
  const onChangeOperatorHandler =
    (conditionIndex: number[], level: number) =>
    (event: SelectChangeEvent<string>, child: React.ReactNode) => {
      const alteredFilterState = { ...configInfo.getFilters() };
      // Alter filter state recursively to the level of the condition
      modifyRecursiveFilterGroups(
        [],
        alteredFilterState.conditions,
        conditionIndex,
        level,
        "operator",
        event.target.value
      );
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };
  return (
    <FormControl fullWidth>
      <Select
        value={currentOp}
        size="small"
        onChange={onChangeOperatorHandler(recursiveIndex, level)}
        style={{
          backgroundColor: StyleVariables.BACKGROUND_PRIMARY,
          color: StyleVariables.TEXT_NORMAL,
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: StyleVariables.BACKGROUND_PRIMARY,
              color: StyleVariables.TEXT_NORMAL,
            },
          },
        }}
      >
        {Object.entries(OperatorFilter).map(([key, value]) => {
          return (
            <MenuItem
              value={key}
              key={`MenuItem-OperatorSelector-${value[0]}-${level}-${recursiveIndex[level]}`}
            >
              {t(value[1] as any)}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default OperatorSelectorComponent;
