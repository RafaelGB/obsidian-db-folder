import Button from "@mui/material/Button";
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

const AtomicFilterComponent = (props: AtomicFilterComponentProps) => {
  const { table, recursiveIndex, level, atomicFilter, possibleColumns } = props;
  const { tableState } = table.options.meta;
  const { field, operator, value } = atomicFilter;
  const configActions = tableState.configState((state) => state.actions);
  const configInfo = tableState.configState((state) => state.info);
  const columns = tableState.columns((state) => state.columns);
  const dataActions = tableState.data((state) => state.actions);

  const deleteConditionHadler =
    (conditionIndex: number[], level: number) => () => {
      const alteredFilterState = { ...configInfo.getFilters() };

      modifyRecursiveFilterGroups(
        possibleColumns,
        alteredFilterState.conditions,
        conditionIndex,
        level,
        ModifyFilterOptionsEnum.DELETE
      );

      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(
        columns,
        configInfo.getLocalSettings(),
        alteredFilterState
      );
    };

  const onChangeFilterValueHandler =
    (conditionIndex: number[], level: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const alteredFilterState = { ...configInfo.getFilters() };
      modifyRecursiveFilterGroups(
        possibleColumns,
        alteredFilterState.conditions,
        conditionIndex,
        level,
        ModifyFilterOptionsEnum.VALUE,
        event.target.value
      );
      configActions.alterFilters(alteredFilterState);
      dataActions.dataviewRefresh(
        columns,
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
        xs="auto"
        key={`Grid-AtomicFilter-field-${level}-${recursiveIndex[level]}`}
      >
        <ExistedColumnSelectorComponent
          currentCol={field}
          recursiveIndex={recursiveIndex}
          level={level}
          table={table}
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
          table={table}
        />
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

export default AtomicFilterComponent;
