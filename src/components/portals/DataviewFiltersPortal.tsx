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
import CrossIcon from "components/img/CrossIcon";
import MenuDownIcon from "components/img/MenuDownIcon";
import { OperatorFilter, StyleVariables } from "helpers/Constants";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";

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
                key={`MenuItem-OperatorSelector-${key}-${selectorProps.index}`}
              >
                {value}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
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
              maxWidth: 420,
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
                    rowSpacing={0.5}
                    columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }}
                    key={`Grid-container-${index}`}
                  >
                    <Grid item xs={4} key={`Grid-field-${index}`}>
                      {existedColumnSelector({
                        currentCol: field,
                        index: index,
                      })}
                    </Grid>
                    <Grid item xs={2} key={`Grid-operator-${index}`}>
                      {operatorSelector({ currentOp: operator, index: index })}
                    </Grid>
                    {/* if value exists, show it */}
                    {value !== undefined && (
                      <Grid item xs={4} key={`Grid-value-${index}`}>
                        <Input
                          key={`Grid-value-input-${index}`}
                          type="text"
                          className="form-control"
                          value={value}
                        />
                      </Grid>
                    )}
                    {/* Remove button */}
                    <Grid item xs={0.25} key={`Grid-remove-${index}`}>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                      >
                        <CrossIcon />
                      </Button>
                    </Grid>
                  </Grid>
                );
              })}
            </Box>
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
            <MenuDownIcon />
          </div>
        </span>
      </Button>

      {domReady
        ? ReactDOM.createPortal(
            currentFilters(),
            activeDocument.getElementById("popper-container")
          )
        : null}
    </>
  );
};

export default DataviewFiltersPortal;
