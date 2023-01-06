import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { OperatorFilter, StyleVariables } from "helpers/Constants";
import { t } from "lang/helpers";
import en from "lang/locale/en";
import React from "react";

const OperatorSelectorComponent = (selectorProps: {
  currentOp: string;
  recursiveIndex: number[];
  level: number;
  onChange: (
    conditionIndex: number[],
    level: number
  ) => (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
}) => {
  const { currentOp, recursiveIndex, level, onChange } = selectorProps;

  return (
    <FormControl fullWidth>
      <Select
        native
        value={currentOp}
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
        {Object.entries(OperatorFilter).map(([key, value], index) => {
          return (
            <option
              value={key}
              key={`MenuItem-${index}-OperatorSelector-${value[0]}-${level}-${recursiveIndex[level]}`}
            >
              {t(value[1] as keyof typeof en)}
            </option>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default OperatorSelectorComponent;
