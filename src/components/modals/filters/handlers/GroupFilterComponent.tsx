import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {
  AtomicFilter,
  FilterGroup,
  FilterGroupCondition,
} from "cdm/SettingsModel";
import { StyleVariables } from "helpers/Constants";
import React from "react";
import AtomicFilterComponent from "components/modals/filters/handlers/AtomicFilterComponent";
import { Table } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import AddIcon from "@mui/icons-material/Add";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderDeleteIcon from "@mui/icons-material/FolderDelete";
import FilterOffIcon from "components/img/FilterOffIcon";
import FilterOnIcon from "components/img/FilterOnIcon";
import modifyRecursiveFilterGroups, {
  ModifyFilterOptionsEnum,
} from "components/modals/filters/handlers/FiltersHelper";
import ConditionSelectorComponent from "components/modals/filters/handlers/ConditionSelectorComponent";
import ToggleButton from "@mui/material/ToggleButton";

const GroupFilterComponent = (groupProps: {
  group: FilterGroup;
  recursiveIndex: number[];
  level: number;
  table: Table<RowDataType>;
  possibleColumns: string[];
}) => {
  const { group, recursiveIndex, level, table, possibleColumns } = groupProps;
  const { tableState } = table.options.meta;
  const configActions = tableState.configState((state) => state.actions);
  const configInfo = tableState.configState((state) => state.info);
  const columnsInfo = tableState.columns((state) => state.info);
  const dataActions = tableState.data((state) => state.actions);
  const onChangeCondition =
    (conditionIndex: number[], level: number) =>
    (event: React.ChangeEvent<HTMLInputElement>, child: React.ReactNode) => {
      commonModifyFilter(
        conditionIndex,
        level,
        ModifyFilterOptionsEnum.CONDITION,
        event.target.value
      );
    };
  const commonModifyFilter = (
    conditionIndex: number[],
    level: number,
    action: string,
    value?: string
  ) => {
    const alteredFilterState = { ...configInfo.getFilters() };
    // Alter filter state recursively to the level of the condition
    modifyRecursiveFilterGroups(
      possibleColumns,
      alteredFilterState.conditions,
      conditionIndex,
      level,
      action,
      value
    );
    configActions.alterFilters(alteredFilterState);
    dataActions.dataviewRefresh(
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings(),
      alteredFilterState
    );
  };

  if ((group as FilterGroupCondition).condition) {
    const filtersOfGroup = (group as FilterGroupCondition).filters;
    const conditionOfGroup = (group as FilterGroupCondition).condition;
    const disabledFlag = (group as FilterGroupCondition).disabled;
    return (
      <div
        key={`div-groupFilterComponent-${level}-${recursiveIndex[level]}`}
        style={{
          border: `2px solid ${StyleVariables.BACKGROUND_SECONDARY}`,
          padding: "4px",
          backgroundColor: disabledFlag
            ? StyleVariables.BACKGROUND_SECONDARY
            : StyleVariables.BACKGROUND_PRIMARY,
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
            key={`Grid-disabled-${level}-${recursiveIndex[level]}`}
          >
            <ToggleButton
              value="check"
              selected={disabledFlag}
              onClick={() =>
                commonModifyFilter(
                  recursiveIndex,
                  level,
                  ModifyFilterOptionsEnum.TOGGLE_DISABLED
                )
              }
            >
              {disabledFlag ? <FilterOffIcon /> : <FilterOnIcon />}
            </ToggleButton>
          </Grid>
          <Grid
            item
            xs="auto"
            key={`Grid-level-${level}-${recursiveIndex[level]}`}
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
              onClick={() =>
                commonModifyFilter(
                  recursiveIndex,
                  level,
                  ModifyFilterOptionsEnum.DELETE
                )
              }
              endIcon={
                <FolderDeleteIcon sx={{ color: StyleVariables.TEXT_ACCENT }} />
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
              onClick={() =>
                commonModifyFilter(
                  recursiveIndex,
                  level,
                  ModifyFilterOptionsEnum.ADD
                )
              }
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
              onClick={() =>
                commonModifyFilter(
                  recursiveIndex,
                  level,
                  ModifyFilterOptionsEnum.ADD_GROUP
                )
              }
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
            <ConditionSelectorComponent
              currentCon={conditionOfGroup}
              recursiveIndex={recursiveIndex}
              level={level}
              onChange={onChangeCondition}
            />
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
                table: table,
                possibleColumns: possibleColumns,
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

export default GroupFilterComponent;
