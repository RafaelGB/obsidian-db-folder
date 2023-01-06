import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { StyleVariables } from "helpers/Constants";
import React from "react";

const ExistedColumnSelectorComponent = (selectorProps: {
  currentCol: string;
  recursiveIndex: number[];
  level: number;
  onchange: (
    conditionIndex: number[],
    level: number
  ) => (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  possibleColumns: string[];
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
          {possibleColumns.map((key, index) => {
            return (
              <option
                value={key}
                key={`MenuItem-${index}-existedColumnSelector-${key}--${level}-${recursiveIndex[level]}}`}
              >
                {key}
              </option>
            );
          })}
        </optgroup>
        <optgroup label="Metadata Fields">
          <option
            value={"__filename__"}
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
