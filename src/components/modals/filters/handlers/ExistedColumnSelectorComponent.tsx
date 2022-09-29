import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Table } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { StyleVariables } from "helpers/Constants";
import React from "react";
import modifyRecursiveFilterGroups, {
  ModifyFilterOptionsEnum,
} from "components/modals/filters/handlers/FiltersHelper";

const ExistedColumnSelectorComponent = (selectorProps: {
  currentCol: string;
  recursiveIndex: number[];
  level: number;
  table: Table<RowDataType>;
  possibleColumns: string[];
}) => {
  const { currentCol, recursiveIndex, level, table, possibleColumns } =
    selectorProps;
  const { tableState } = table.options.meta;
  const configActions = tableState.configState((state) => state.actions);
  const configInfo = tableState.configState((state) => state.info);
  const columnsInfo = tableState.columns((state) => state.info);
  const dataActions = tableState.data((state) => state.actions);
  const onchangeExistedColumnHandler =
    (conditionIndex: number[], level: number) =>
    (event: SelectChangeEvent<string>, child: React.ReactNode) => {
      const alteredFilterState = { ...configInfo.getFilters() };
      modifyRecursiveFilterGroups(
        possibleColumns,
        alteredFilterState.conditions,
        conditionIndex,
        level,
        ModifyFilterOptionsEnum.FIELD,
        event.target.value
      );
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(
        columnsInfo.getAllColumns(),
        configInfo.getLocalSettings(),
        alteredFilterState
      );
    };
  return (
    <FormControl
      fullWidth
      key={`FormControl-existedColumnSelector-${level}-${recursiveIndex[level]}`}
    >
      <Select
        value={currentCol}
        size="small"
        key={`Select-existedColumnSelector-${level}-${recursiveIndex[level]}`}
        onChange={onchangeExistedColumnHandler(recursiveIndex, level)}
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
        {possibleColumns.map((key) => {
          return (
            <MenuItem
              value={key}
              key={`MenuItem-existedColumnSelector-${key}--${level}-${recursiveIndex[level]}}`}
            >
              {key}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
export default ExistedColumnSelectorComponent;
