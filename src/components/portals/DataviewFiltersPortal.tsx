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
import MenuDownIcon from "components/img/MenuDownIcon";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { OperatorFilter, StyleVariables } from "helpers/Constants";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import { Notice } from "obsidian";
import MenuUpIcon from "components/img/MenuUpIcon";

const DataviewFiltersPortal = (props: DataviewFiltersProps) => {
  const { table } = props;
  const { tableState, view } = table.options.meta;
  const [ddbbConfig, filters, configActions] = tableState.configState(
    (state) => [state.ddbbConfig, state.filters, state.actions]
  );

  const columns = tableState.columns((state) => state.columns);
  const dataActions = tableState.data((state) => state.actions);
  const [filtersRef, setFiltersRef] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Selector popper state
  const [selectPop, setSelectPop] = useState(null);
  const { styles, attributes } = usePopper(filtersRef, selectPop);

  const [domReady, setDomReady] = useState(false);

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
      setPossibleColumns(Object.keys(columns));
    });
  }, [ddbbConfig, columns]);

  React.useEffect(() => {
    if (!domReady) {
      setDomReady(true);
    }
  });

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
        >
          {Object.entries(OperatorFilter).map(([key, value]) => {
            return (
              <MenuItem
                value={key}
                key={`MenuItem-OperatorSelector-${value[0]}-${selectorProps.index}`}
              >
                {value[1]}
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
  const addConditionHandler = () => {
    // Check if there is a condition to add
    if (possibleColumns.length <= 0) {
      new Notice(
        "No columns available yet. Include a field in one of your notes before add a filter",
        3000
      );
      return;
    }

    const alteredFilterState = { ...filters };
    alteredFilterState.conditions.push({
      field: possibleColumns[0],
      operator: OperatorFilter.CONTAINS[0],
      value: "",
    });
    configActions.alterFilters(alteredFilterState);
  };
  const currentFilters = () => {
    return (
      <div>
        {/* hide selector if click outside of it */}
        {showFilters && (
          <div className="overlay" onClick={() => setShowFilters(false)} />
        )}
        {/* show selector if click on the current value */}
        {showFilters && (
          <div
            className="menu"
            ref={setSelectPop}
            {...attributes.popper}
            style={{
              ...styles.popper,
              zIndex: 4,
              minWidth: 200,
              maxWidth: 500,
              padding: "0.75rem",
              background: StyleVariables.BACKGROUND_SECONDARY,
            }}
          >
            <Box sx={{ width: "100%" }}>
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
            </Box>
            {/* Add button */}
            <Button
              size="small"
              key={`Button-Plus-DataviewFilters`}
              variant="outlined"
              startIcon={<AddIcon />}
              style={{
                borderColor: StyleVariables.TEXT_NORMAL,
                color: StyleVariables.TEXT_NORMAL,
              }}
              onClick={addConditionHandler}
            >
              Add filter
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Button
        size="small"
        onClick={() => setShowFilters(true)}
        key={`Button-FilterConditions-DataviewFilters`}
      >
        <span
          className="svg-icon svg-gray"
          style={{ marginRight: 8 }}
          key={`Span-FilterConditions-Ref-Portal`}
        >
          <div ref={setFiltersRef} key={`Div-FilterConditions-Ref-Portal`}>
            {showFilters ? <MenuUpIcon /> : <MenuDownIcon />}
          </div>
        </span>
      </Button>

      {domReady
        ? ReactDOM.createPortal(
            currentFilters(),
            activeDocument.getElementById(`${view.file.path}-popper`)
          )
        : null}
    </>
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
