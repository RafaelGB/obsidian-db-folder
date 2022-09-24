import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";

import Input from "@mui/material/Input";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DataviewFiltersProps } from "cdm/ComponentsModel";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { obtainColumnsFromRows } from "components/Columns";
import DeleteIcon from "@mui/icons-material/Delete";
import { OperatorFilter, StyleVariables } from "helpers/Constants";
import React, { useState } from "react";
import { t } from "lang/helpers";

const DataviewFiltersPortal = (props: DataviewFiltersProps) => {
  const { table } = props;
  const { tableState, view } = table.options.meta;
  const [ddbbConfig, configActions] = tableState.configState((state) => [
    state.ddbbConfig,
    state.actions,
  ]);
  const filters = tableState.configState((state) => state.filters);
  const columns = tableState.columns((state) => state.columns);
  const dataActions = tableState.data((state) => state.actions);

  const [possibleColumns, setPossibleColumns] = useState([] as string[]);

  React.useEffect(() => {
    new Promise<Record<string, DatabaseColumn>>((resolve, reject) => {
      // Empty conditions to refresh the dataview
      const emptyFilterConditions = { ...filters };
      emptyFilterConditions.conditions = [];
      resolve(
        obtainColumnsFromRows(view, ddbbConfig, emptyFilterConditions, columns)
      );
    }).then((columns) => {
      setPossibleColumns(
        Object.keys(columns).sort((a, b) => a.localeCompare(b))
      );
    });
  }, [ddbbConfig, columns]);

  const onchangeExistedColumnHandler =
    (existedColumnIndex: number) =>
    (event: SelectChangeEvent<string>, child: React.ReactNode) => {
      const alteredFilterState = { ...filters };
      alteredFilterState.conditions[existedColumnIndex].field =
        event.target.value;
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };

  const onChangeOperatorHandler =
    (operatorIndex: number) =>
    (event: SelectChangeEvent<string>, child: React.ReactNode) => {
      const alteredFilterState = { ...filters };
      alteredFilterState.conditions[operatorIndex].operator =
        event.target.value;
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };

  const existedColumnSelector = (selectorProps: {
    currentCol: string;
    index: number;
  }) => {
    return (
      <FormControl
        fullWidth
        key={`FormControl-existedColumnSelector-${selectorProps.index}`}
      >
        <Select
          value={selectorProps.currentCol}
          size="small"
          key={`Select-existedColumnSelector-${selectorProps.index}`}
          onChange={onchangeExistedColumnHandler(selectorProps.index)}
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
                key={`MenuItem-existedColumnSelector-${key}-${selectorProps.index}`}
              >
                {key}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  const operatorSelector = (selectorProps: {
    currentOp: string;
    index: number;
  }) => {
    return (
      <FormControl fullWidth>
        <Select
          value={selectorProps.currentOp}
          size="small"
          onChange={onChangeOperatorHandler(selectorProps.index)}
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
                key={`MenuItem-OperatorSelector-${value[0]}-${selectorProps.index}`}
              >
                {t(value[1] as any)}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  const onChangeFilterValueHandler =
    (valueIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const alteredFilterState = { ...filters };
      alteredFilterState.conditions[valueIndex].value = event.target.value;
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };

  const deleteConditionHadler = (conditionIndex: number) => () => {
    const alteredFilterState = { ...filters };
    alteredFilterState.conditions.splice(conditionIndex, 1);
    configActions.alterFilters(alteredFilterState);
    dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
  };

  return (
    <div>
      {filters.conditions.map((condition, index) => {
        const { field, operator, value } = condition;
        return (
          <Grid
            container
            rowSpacing={0.25}
            columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }}
            key={`Grid-container-${index}`}
          >
            <Grid item xs="auto" key={`Grid-field-${index}`}>
              {existedColumnSelector({
                currentCol: field,
                index: index,
              })}
            </Grid>
            <Grid item xs="auto" key={`Grid-operator-${index}`}>
              {operatorSelector({ currentOp: operator, index: index })}
            </Grid>
            {/* if value exists, show it */}
            {![
              OperatorFilter.IS_EMPTY[0],
              OperatorFilter.IS_NOT_EMPTY[0],
            ].contains(operator) && (
              <Grid item xs={3.5} key={`Grid-value-${index}`}>
                <ValueFilterComponent
                  value={value}
                  handler={onChangeFilterValueHandler(index)}
                />
              </Grid>
            )}
            {/* Remove button */}
            <Grid item xs={0.75} key={`Grid-remove-${index}`}>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={deleteConditionHadler(index)}
                endIcon={<DeleteIcon />}
              />
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
};

function ValueFilterComponent(props: {
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}) {
  const [value, setValue] = useState(props.value);
  const [valueTimeout, setValueTimeout] = useState(null);
  const proxyHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (valueTimeout) {
      clearTimeout(valueTimeout);
    }
    // first update the input text as user type
    setValue(event.target.value);
    // initialize a setimeout by wrapping in our editNoteTimeout so that we can clear it out using clearTimeout
    setValueTimeout(
      setTimeout(() => {
        props.handler(event);
        // timeout until event is triggered after user has stopped typing
      }, 1500)
    );
  };
  return (
    <Input
      type="text"
      className="form-control"
      value={value}
      onChange={proxyHandler}
    />
  );
}
export default DataviewFiltersPortal;
