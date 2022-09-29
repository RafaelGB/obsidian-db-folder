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
  onChange: (
    conditionIndex: number[],
    level: number
  ) => (
    event: React.ChangeEvent<HTMLInputElement>,
    child: React.ReactNode
  ) => void;
}) => {
  const { currentCon, recursiveIndex, level, onChange } = selectorProps;

  return (
    <FormControl fullWidth>
      <Select
        value={currentCon}
        size="small"
        onChange={onChange(recursiveIndex, level)}
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
