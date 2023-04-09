import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { StyleVariables } from "helpers/Constants";
import React from "react";
import { ColumnFilterOption } from "../model/FiltersModel";

const ExistedColumnSelectorComponent = (selectorProps: {
  currentCol: string;
  recursiveIndex: number[];
  level: number;
  onchange: (
    conditionIndex: number[],
    level: number
  ) => (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  possibleColumns: ColumnFilterOption[];
}) => {
  const { currentCol, recursiveIndex, level, onchange, possibleColumns } =
    selectorProps;
  return (
    <FormControl
      fullWidth
      key={`FormControl-existedColumnSelector-${level}-${recursiveIndex[level]}`}
    >
      <Select
        native
        value={currentCol}
        size="small"
        key={`Select-existedColumnSelector-${level}-${recursiveIndex[level]}`}
        onChange={onchange(recursiveIndex, level)}
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
        <optgroup label="Fields from notes">
          {possibleColumns.map((columnOption, index) => {
            return (
              <option
                value={columnOption.key}
                key={`MenuItem-${index}-existedColumnSelector-${columnOption.key}--${level}-${recursiveIndex[level]}}`}
              >
                {columnOption.key}
              </option>
            );
          })}
        </optgroup>
        <optgroup label="Metadata Fields">
          <option
            value={"file.name"}
            key={`MenuItem-Metadata-filename--${level}-${recursiveIndex[level]}`}
          >
            Filename
          </option>
        </optgroup>
      </Select>
    </FormControl>
  );
};
export default ExistedColumnSelectorComponent;
