import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { AtomicFilterComponentProps } from "cdm/ComponentsModel";
import { OperatorFilter, StyleVariables } from "helpers/Constants";
import React from "react";
import ValueFilterComponent from "components/modals/filters/handlers/ValueFilterComponent";
import modifyRecursiveFilterGroups, {
  ModifyFilterOptionsEnum,
} from "components/modals/filters/handlers/FiltersHelper";
import OperatorSelectorComponent from "components/modals/filters/handlers/OperatorSelectorComponent";
import ExistedColumnSelectorComponent from "components/modals/filters/handlers/ExistedColumnSelectorComponent";
import { SelectChangeEvent } from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";

const AtomicFilterComponent = (props: AtomicFilterComponentProps) => {
  const { table, recursiveIndex, level, atomicFilter, possibleColumns } = props;
  const { tableState } = table.options.meta;
  const { field, operator, value } = atomicFilter;
  const configActions = tableState.configState((state) => state.actions);
  const configInfo = tableState.configState((state) => state.info);
  const columnsInfo = tableState.columns((state) => state.info);
  const dataActions = tableState.data((state) => state.actions);

  const onChangeFilterValueHandler =
    (conditionIndex: number[], level: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      commonModifyFilter(
        conditionIndex,
        level,
        ModifyFilterOptionsEnum.VALUE,
        event.target.value
      );
    };

  const onchangeExistedColumnHandler =
    (conditionIndex: number[], level: number) =>
    (event: SelectChangeEvent<string>, child: React.ReactNode) => {
      commonModifyFilter(
        conditionIndex,
        level,
        ModifyFilterOptionsEnum.FIELD,
        event.target.value
      );
    };
  const onChangeOperatorHandler =
    (conditionIndex: number[], level: number) =>
    (event: SelectChangeEvent<string>, child: React.ReactNode) => {
      commonModifyFilter(
        conditionIndex,
        level,
        ModifyFilterOptionsEnum.OPERATOR,
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
  return (
    <Grid
      container
      rowSpacing={0.25}
      columnSpacing={{ xs: 0.25, sm: 0.5, md: 0.75 }}
      key={`Grid-AtomicFilter-row-${level}-${recursiveIndex[level]}`}
    >
      <Grid
        item
        xs={3.5}
        key={`Grid-AtomicFilter-field-${level}-${recursiveIndex[level]}`}
      >
        <ExistedColumnSelectorComponent
          currentCol={field}
          recursiveIndex={recursiveIndex}
          level={level}
          onchange={onchangeExistedColumnHandler}
          possibleColumns={possibleColumns}
        />
      </Grid>
      <Grid
        item
        xs="auto"
        key={`Grid-AtomicFilter-operator-${level}-${recursiveIndex[level]}`}
      >
        <OperatorSelectorComponent
          currentOp={operator}
          recursiveIndex={recursiveIndex}
          level={level}
          onChange={onChangeOperatorHandler}
        />
      </Grid>
      {/* if value exists, show it */}
      {![OperatorFilter.IS_EMPTY[0], OperatorFilter.IS_NOT_EMPTY[0]].contains(
        operator
      ) && (
        <Grid
          item
          xs={3}
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
        xs={0.55}
        key={`Grid-remove-${level}-${recursiveIndex[level]}`}
      >
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() =>
            commonModifyFilter(
              recursiveIndex,
              level,
              ModifyFilterOptionsEnum.DELETE
            )
          }
        >
          <DeleteIcon sx={{ color: StyleVariables.TEXT_ACCENT }} />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default AtomicFilterComponent;
