import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Table } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { ConditionFiltersOptions, StyleVariables } from "helpers/Constants";
import React from "react";
import modifyRecursiveFilterGroups, {
  ModifyFilterOptionsEnum,
} from "components/modals/filters/handlers/FiltersHelper";

const ConditionSelectorComponent = (selectorProps: {
  currentCon: string;
  recursiveIndex: number[];
  level: number;
  table: Table<RowDataType>;
}) => {
  const { currentCon, recursiveIndex, level, table } = selectorProps;
  const { tableState } = table.options.meta;
  const configActions = tableState.configState((state) => state.actions);
  const configInfo = tableState.configState((state) => state.info);
  const columns = tableState.columns((state) => state.columns);
  const dataActions = tableState.data((state) => state.actions);
  const onChangeCondition =
    (conditionIndex: number[], level: number) =>
    (event: React.ChangeEvent<HTMLInputElement>, child: React.ReactNode) => {
      const alteredFilterState = { ...configInfo.getFilters() };
      // Alter filter state recursively to the level of the condition
      modifyRecursiveFilterGroups(
        [],
        alteredFilterState.conditions,
        conditionIndex,
        level,
        ModifyFilterOptionsEnum.CONDITION,
        event.target.value
      );
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(
        columns,
        configInfo.getLocalSettings(),
        alteredFilterState
      );
    };
  return (
    <FormControl fullWidth>
      <Select
        value={currentCon}
        size="small"
        onChange={onChangeCondition(recursiveIndex, level)}
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
        {Object.entries(ConditionFiltersOptions).map(([key, value]) => {
          return (
            <MenuItem
              value={key}
              key={`MenuItem-ConditionSelector-${value[0]}-${recursiveIndex[level]}`}
            >
              {value}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
export default ConditionSelectorComponent;
