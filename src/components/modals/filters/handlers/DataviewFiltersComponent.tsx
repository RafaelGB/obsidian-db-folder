import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import { DataviewFiltersProps } from "cdm/ComponentsModel";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { obtainColumnsFromRows } from "components/Columns";
import FolderDeleteIcon from "@mui/icons-material/FolderDelete";
import AddIcon from "@mui/icons-material/Add";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { ConditionFiltersOptions, StyleVariables } from "helpers/Constants";
import React, { useState } from "react";
import {
  AtomicFilter,
  FilterGroup,
  FilterGroupCondition,
} from "cdm/SettingsModel";
import AtomicFilterComponent from "components/modals/filters/handlers/AtomicFilterComponent";
import modifyRecursiveFilterGroups from "components/modals/filters/handlers/FiltersHelper";

const DataviewFiltersComponent = (props: DataviewFiltersProps) => {
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

  const onChangeCondition =
    (conditionIndex: number[], level: number) =>
    (event: React.ChangeEvent<HTMLInputElement>, child: React.ReactNode) => {
      const alteredFilterState = { ...configInfo.getFilters() };
      // Alter filter state recursively to the level of the condition
      modifyRecursiveFilterGroups(
        possibleColumns,
        alteredFilterState.conditions,
        conditionIndex,
        level,
        "condition",
        event.target.value
      );
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };

  const ConditionSelector = (selectorProps: {
    currentCon: string;
    recursiveIndex: number[];
    level: number;
  }) => {
    const { currentCon, recursiveIndex, level } = selectorProps;
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

  const addAtomicFilterOnGroupHandler =
    (conditionIndex: number[], level: number) => () => {
      const alteredFilterState = { ...configInfo.getFilters() };

      modifyRecursiveFilterGroups(
        possibleColumns,
        alteredFilterState.conditions,
        conditionIndex,
        level,
        "add"
      );

      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };
  const addGroupFilterOnGroupHandler =
    (conditionIndex: number[], level: number) => () => {
      const alteredFilterState = { ...configInfo.getFilters() };

      modifyRecursiveFilterGroups(
        possibleColumns,
        alteredFilterState.conditions,
        conditionIndex,
        level,
        "addGroup"
      );

      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
    };

  const deleteConditionHadler =
    (conditionIndex: number[], level: number) => () => {
      const alteredFilterState = { ...configInfo.getFilters() };

      modifyRecursiveFilterGroups(
        possibleColumns,
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
                onClick={deleteConditionHadler(recursiveIndex, level)}
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
              key={`Grid-add-atomic-filter-${level}-${recursiveIndex[level]}`}
            >
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={addAtomicFilterOnGroupHandler(recursiveIndex, level)}
                endIcon={<AddIcon sx={{ color: StyleVariables.TEXT_ACCENT }} />}
              />
            </Grid>
            <Grid
              item
              xs="auto"
              key={`Grid-add-group-filter-${level}-${recursiveIndex[level]}`}
            >
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={addGroupFilterOnGroupHandler(recursiveIndex, level)}
                endIcon={
                  <CreateNewFolderIcon
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
      return (
        <AtomicFilterComponent
          recursiveIndex={recursiveIndex}
          level={level}
          atomicFilter={group as AtomicFilter}
          possibleColumns={possibleColumns}
          table={table}
        />
      );
    }
  };
  /** ATOMIC FILTER COMPONENT */

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

export default DataviewFiltersComponent;
