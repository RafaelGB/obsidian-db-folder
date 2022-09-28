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
import {
  ConditionFiltersOptions,
  OperatorFilter,
  StyleVariables,
} from "helpers/Constants";
import React, { useState } from "react";
import { t } from "lang/helpers";
import {
  AtomicFilter,
  FilterGroup,
  FilterGroupCondition,
} from "cdm/SettingsModel";

const DataviewFiltersPortal = (props: DataviewFiltersProps) => {
  const { table } = props;
  const { tableState, view } = table.options.meta;
  const [ddbbConfig, configActions] = tableState.configState((state) => [
    state.ddbbConfig,
    state.actions,
  ]);
  const configInfo = tableState.configState((state) => state.info);
  const columns = tableState.columns((state) => state.columns);
  const dataActions = tableState.data((state) => state.actions);

  const [possibleColumns, setPossibleColumns] = useState([] as string[]);

  React.useEffect(() => {
    new Promise<Record<string, DatabaseColumn>>((resolve, reject) => {
      // Empty conditions to refresh the dataview
      const emptyFilterConditions = { ...configInfo.getFilters() };
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
    (conditionIndex: number) =>
    (event: SelectChangeEvent<string>, child: React.ReactNode) => {
      const alteredFilterState = { ...configInfo.getFilters() };
      (alteredFilterState.conditions[conditionIndex] as AtomicFilter).field =
        event.target.value;
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };

  const onChangeOperatorHandler =
    (conditionIndex: number, level: number) =>
    (event: SelectChangeEvent<string>, child: React.ReactNode) => {
      const alteredFilterState = { ...configInfo.getFilters() };
      (alteredFilterState.conditions[conditionIndex] as AtomicFilter).operator =
        event.target.value;
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };

  const existedColumnSelector = (selectorProps: {
    currentCol: string;
    index: number;
    level: number;
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
    level: number;
  }) => {
    const { currentOp, index, level } = selectorProps;
    return (
      <FormControl fullWidth>
        <Select
          value={currentOp}
          size="small"
          onChange={onChangeOperatorHandler(index, level)}
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
                key={`MenuItem-OperatorSelector-${value[0]}-${index}`}
              >
                {t(value[1] as any)}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  const ConditionSelector = (selectorProps: {
    currentCon: string;
    index: number;
    level: number;
  }) => {
    const { currentCon, index, level } = selectorProps;
    return (
      <FormControl fullWidth>
        <Select
          value={currentCon}
          size="small"
          onChange={onChangeOperatorHandler(index, level)}
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
                key={`MenuItem-ConditionSelector-${value[0]}-${index}`}
              >
                {value}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  const onChangeFilterValueHandler =
    (conditionIndex: number, level: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const alteredFilterState = { ...configInfo.getFilters() };
      (alteredFilterState.conditions[conditionIndex] as AtomicFilter).value =
        event.target.value;
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };

  const deleteConditionHadler = (conditionIndex: number) => () => {
    const alteredFilterState = { ...configInfo.getFilters() };
    alteredFilterState.conditions.splice(conditionIndex, 1);
    configActions.alterFilters(alteredFilterState);
    dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
  };
  /** GROUP FILTER COMPONENT */
  const GroupFilterComponent = (groupProps: {
    group: FilterGroup;
    index: number;
    level: number;
  }) => {
    const { group, index, level } = groupProps;
    if ((group as FilterGroupCondition).condition) {
      const filtersOfGroup = (group as FilterGroupCondition).filters;
      const conditionOfGroup = (group as FilterGroupCondition).condition;
      return (
        <div
          key={`div-groupFilterComponent-${index}-${level}`}
          style={{
            border: `1px solid ${StyleVariables.BACKGROUND_SECONDARY}`,
          }}
        >
          <Grid
            container
            rowSpacing={0.25}
            columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }}
            key={`Grid-AtomicFilter-${index}-${level}`}
          >
            <Grid
              item
              xs="auto"
              key={`Grid-AtomicFilter-operator-${index}-${level}`}
            >
              {ConditionSelector({
                currentCon: conditionOfGroup,
                index: index,
                level: level,
              })}
            </Grid>
            <Grid
              item
              xs={12}
              key={`Grid-AtomicFilter-value-${index}-${level}`}
            >
              {filtersOfGroup.map((filter, filterIndex) => {
                return GroupFilterComponent({
                  group: filter as FilterGroupCondition,
                  index: filterIndex,
                  level: level + 1,
                });
              })}
            </Grid>
          </Grid>
        </div>
      );
    } else {
      return AtomicFilterComponent({
        index: index,
        level: 0,
        atomicFilter: group as AtomicFilter,
      });
    }
  };
  /** ATOMIC FILTER COMPONENT */
  const AtomicFilterComponent = (props: {
    index: number;
    level: number;
    atomicFilter: AtomicFilter;
  }) => {
    const { index, level, atomicFilter } = props;
    const { field, operator, value } = atomicFilter;
    return (
      <Grid
        container
        rowSpacing={0.25}
        columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }}
        key={`Grid-AtomicFilter-${index}-${level}`}
      >
        <Grid item xs="auto" key={`Grid-AtomicFilter-field-${index}`}>
          {existedColumnSelector({
            currentCol: field,
            index: index,
            level: level,
          })}
        </Grid>
        <Grid item xs="auto" key={`Grid-AtomicFilter-operator-${index}`}>
          {operatorSelector({
            currentOp: operator,
            index: index,
            level: level,
          })}
        </Grid>
        {/* if value exists, show it */}
        {![OperatorFilter.IS_EMPTY[0], OperatorFilter.IS_NOT_EMPTY[0]].contains(
          operator
        ) && (
          <Grid item xs={3.5} key={`Grid-AtomicFilter-value-${index}`}>
            <ValueFilterComponent
              value={value}
              handler={onChangeFilterValueHandler(index, level)}
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
  };

  return (
    <div>
      {configInfo.getFilters().conditions.map((condition, index) => {
        /** Recursive component */
        return GroupFilterComponent({
          group: condition as FilterGroupCondition,
          index: index,
          level: 0,
        });
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
