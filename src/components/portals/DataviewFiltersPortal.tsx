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
import FolderDeleteIcon from "@mui/icons-material/FolderDelete";
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
    (conditionIndex: number[], level: number) =>
    (event: SelectChangeEvent<string>, child: React.ReactNode) => {
      const alteredFilterState = { ...configInfo.getFilters() };
      modifyRecursiveFilterGroups(
        alteredFilterState.conditions,
        conditionIndex,
        level,
        "field",
        event.target.value
      );
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };

  const onChangeOperatorHandler =
    (conditionIndex: number[], level: number) =>
    (event: SelectChangeEvent<string>, child: React.ReactNode) => {
      const alteredFilterState = { ...configInfo.getFilters() };
      // Alter filter state recursively to the level of the condition
      modifyRecursiveFilterGroups(
        alteredFilterState.conditions,
        conditionIndex,
        level,
        "operator",
        event.target.value
      );
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };

  const onChangeCondition =
    (conditionIndex: number[], level: number) =>
    (event: React.ChangeEvent<HTMLInputElement>, child: React.ReactNode) => {
      const alteredFilterState = { ...configInfo.getFilters() };
      // Alter filter state recursively to the level of the condition
      console.log("before", alteredFilterState);
      modifyRecursiveFilterGroups(
        alteredFilterState.conditions,
        conditionIndex,
        level,
        "condition",
        event.target.value
      );
      console.log("after", alteredFilterState);
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };

  const existedColumnSelector = (selectorProps: {
    currentCol: string;
    recursiveIndex: number[];
    level: number;
  }) => {
    const { currentCol, recursiveIndex, level } = selectorProps;
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

  const operatorSelector = (selectorProps: {
    currentOp: string;
    recursiveIndex: number[];
    level: number;
  }) => {
    const { currentOp, recursiveIndex, level } = selectorProps;
    return (
      <FormControl fullWidth>
        <Select
          value={currentOp}
          size="small"
          onChange={onChangeOperatorHandler(recursiveIndex, level)}
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
                key={`MenuItem-OperatorSelector-${value[0]}-${level}-${recursiveIndex[level]}`}
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
    recursiveIndex: number[];
    level: number;
  }) => {
    const { currentCon, recursiveIndex, level } = selectorProps;
    console.log(`currentCon: ${currentCon}`);
    return (
      <FormControl fullWidth>
        <Select
          value={currentCon}
          size="small"
          onChange={onChangeCondition(recursiveIndex, level)}
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

  const onChangeFilterValueHandler =
    (conditionIndex: number[], level: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const alteredFilterState = { ...configInfo.getFilters() };
      modifyRecursiveFilterGroups(
        alteredFilterState.conditions,
        conditionIndex,
        level,
        "value",
        event.target.value
      );
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };

  const deleteGroupConditionHandler = (filterIndex: number) => () => {
    const alteredFilterState = { ...configInfo.getFilters() };
    alteredFilterState.conditions.splice(filterIndex, 1);

    configActions.alterFilters(alteredFilterState);
    dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
  };

  const deleteConditionHadler =
    (conditionIndex: number[], level: number) => () => {
      const alteredFilterState = { ...configInfo.getFilters() };

      modifyRecursiveFilterGroups(
        alteredFilterState.conditions,
        conditionIndex,
        level,
        "delete"
      );

      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };
  /** GROUP FILTER COMPONENT */
  const GroupFilterComponent = (groupProps: {
    group: FilterGroup;
    recursiveIndex: number[];
    level: number;
  }) => {
    const { group, recursiveIndex, level } = groupProps;
    if ((group as FilterGroupCondition).condition) {
      console.log(`condition at level ${level}`);
      const filtersOfGroup = (group as FilterGroupCondition).filters;
      const conditionOfGroup = (group as FilterGroupCondition).condition;
      return (
        <div
          key={`div-groupFilterComponent-${level}-${recursiveIndex[level]}`}
          style={{
            border: `2px solid ${StyleVariables.BACKGROUND_SECONDARY}`,
            padding: "4px",
          }}
        >
          <Grid
            container
            rowSpacing={0.25}
            columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }}
            key={`Grid-AtomicFilter-${level}-${recursiveIndex[level]}`}
          >
            <Box sx={{ flexGrow: 1 }} />
            <Grid
              item
              xs="auto"
              key={`Grid-label-${level}-${recursiveIndex[level]}`}
            >
              {`level ${level}`}
            </Grid>
            <Grid
              item
              xs="auto"
              key={`Grid-remove-group-${level}-${recursiveIndex[level]}`}
            >
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={deleteGroupConditionHandler(recursiveIndex[level])}
                endIcon={
                  <FolderDeleteIcon
                    sx={{ color: StyleVariables.TEXT_ACCENT }}
                  />
                }
              />
            </Grid>
            <Grid
              item
              xs="auto"
              key={`Grid-AtomicFilter-operator-${level}-${recursiveIndex[level]}`}
            >
              {ConditionSelector({
                currentCon: conditionOfGroup,
                recursiveIndex: recursiveIndex,
                level: level,
              })}
            </Grid>
            <Grid
              item
              xs={12}
              key={`Grid-AtomicFilter-value-${level}-${recursiveIndex[level]}`}
            >
              {filtersOfGroup.map((filter, filterIndex) => {
                return GroupFilterComponent({
                  group: filter as FilterGroupCondition,
                  recursiveIndex: [...recursiveIndex, filterIndex],
                  level: level + 1,
                });
              })}
            </Grid>
          </Grid>
        </div>
      );
    } else {
      return AtomicFilterComponent({
        recursiveIndex: recursiveIndex,
        level: level,
        atomicFilter: group as AtomicFilter,
      });
    }
  };
  /** ATOMIC FILTER COMPONENT */
  const AtomicFilterComponent = (props: {
    recursiveIndex: number[];
    level: number;
    atomicFilter: AtomicFilter;
  }) => {
    const { recursiveIndex, level, atomicFilter } = props;
    const { field, operator, value } = atomicFilter;
    return (
      <Grid
        container
        rowSpacing={0.25}
        columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }}
        key={`Grid-AtomicFilter-row-${level}-${recursiveIndex[level]}`}
      >
        <Grid
          item
          xs="auto"
          key={`Grid-AtomicFilter-field-${level}-${recursiveIndex[level]}`}
        >
          {existedColumnSelector({
            currentCol: field,
            recursiveIndex: recursiveIndex,
            level: level,
          })}
        </Grid>
        <Grid
          item
          xs="auto"
          key={`Grid-AtomicFilter-operator-${level}-${recursiveIndex[level]}`}
        >
          {operatorSelector({
            currentOp: operator,
            recursiveIndex: recursiveIndex,
            level: level,
          })}
        </Grid>
        {/* if value exists, show it */}
        {![OperatorFilter.IS_EMPTY[0], OperatorFilter.IS_NOT_EMPTY[0]].contains(
          operator
        ) && (
          <Grid
            item
            xs={3.5}
            key={`Grid-AtomicFilter-value-${level}-${recursiveIndex[level]}`}
          >
            <ValueFilterComponent
              value={value}
              handler={onChangeFilterValueHandler(recursiveIndex, level)}
            />
          </Grid>
        )}
        {/* Remove button */}
        <Grid
          item
          xs={0.75}
          key={`Grid-remove-${level}-${recursiveIndex[level]}`}
        >
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={deleteConditionHadler(recursiveIndex, level)}
            endIcon={<DeleteIcon sx={{ color: StyleVariables.TEXT_ACCENT }} />}
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
          recursiveIndex: [index],
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

function modifyRecursiveFilterGroups(
  filterGroups: FilterGroup[],
  recursiveIndex: number[],
  level: number,
  key: string,
  value?: string,
  currentLvl = 0
) {
  if (level === currentLvl) {
    // last level
    if (key === "condition") {
      (filterGroups[recursiveIndex[level]] as FilterGroupCondition).condition =
        value;
    } else if (key === "operator") {
      (filterGroups[recursiveIndex[level]] as AtomicFilter).operator = value;
    } else if (key === "field") {
      (filterGroups[recursiveIndex[level]] as AtomicFilter).field = value;
    } else if (key === "value") {
      (filterGroups[recursiveIndex[level]] as AtomicFilter).value = value;
    } else if (key === "delete") {
      filterGroups.splice(recursiveIndex[currentLvl], 1);
    }
  } else {
    modifyRecursiveFilterGroups(
      (filterGroups[recursiveIndex[currentLvl]] as FilterGroupCondition)
        .filters,
      recursiveIndex,
      level,
      key,
      value,
      currentLvl + 1
    );
  }
}

export default DataviewFiltersPortal;
