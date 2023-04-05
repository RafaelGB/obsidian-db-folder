import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { InputType, OperatorFilter, StyleVariables } from "helpers/Constants";
import { t } from "lang/helpers";
import en from "lang/locale/en";
import React from "react";

const OperatorSelectorComponent = (selectorProps: {
  currentOp: string;
  recursiveIndex: number[];
  type: string;
  level: number;
  onChange: (
    conditionIndex: number[],
    level: number
  ) => (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
}) => {
  const { currentOp, recursiveIndex, level, onChange, type } = selectorProps;

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
        {operatorFilterEntriesInFuctionOf(type).map(([key, value], index) => {
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
function operatorFilterEntriesInFuctionOf(type: string) {
  const rawOperators = Object.entries(OperatorFilter);
  switch (type) {
    case InputType.CALENDAR:
    case InputType.CALENDAR_TIME:
      return rawOperators.filter(
        (op) =>
          ![
            OperatorFilter.CONTAINS[0],
            OperatorFilter.NOT_CONTAINS[0],
            OperatorFilter.STARTS_WITH[0],
            OperatorFilter.ENDS_WITH[0],
          ].contains(op[0])
      );
    default:
      return rawOperators;
  }
}

export default OperatorSelectorComponent;
