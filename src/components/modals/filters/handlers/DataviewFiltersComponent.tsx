import { ColumnFilterOption, DataviewFiltersProps } from "cdm/ComponentsModel";
import { obtainColumnsFromRows } from "components/Columns";
import React, { useEffect, useState } from "react";
import { FilterGroupCondition } from "cdm/SettingsModel";
import GroupFilterComponent from "components/modals/filters/handlers/GroupFilterComponent";
import DnDComponent from "components/behavior/DnDComponent";
import { InputType } from "helpers/Constants";

const DataviewFiltersComponent = (props: DataviewFiltersProps) => {
  const { table } = props;
  const { tableState, view } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);
  const configActions = tableState.configState((state) => state.actions);
  const filters = tableState.configState((state) => state.filters);
  const columnsInfo = tableState.columns((state) => state.info);

  const [possibleColumns, setPossibleColumns] = useState(
    [] as ColumnFilterOption[]
  );
  const DbColumns = columnsInfo.getAllColumns();
  useEffect(() => {
    new Promise<string[]>((resolve) => {
      // Empty conditions to refresh the dataview
      const emptyFilterConditions = { ...filters };
      emptyFilterConditions.conditions = [];
      resolve(
        obtainColumnsFromRows(
          view.file.parent.path,
          configInfo.getLocalSettings(),
          emptyFilterConditions,
          DbColumns
        )
      );
    }).then((columns) => {
      const columnOptions: ColumnFilterOption[] = [];
      columns.forEach((column) => {
        const possibleColumn = DbColumns.find(
          (dbColumn) => dbColumn.key === column
        );
        const isColumnExistent = possibleColumn !== undefined;
        columnOptions.push({
          enabled: isColumnExistent,
          key: column,
          type: isColumnExistent ? possibleColumn.input : InputType.TEXT,
        });
      });
      setPossibleColumns(
        columnOptions.sort((a, b) => a.key.localeCompare(b.key))
      );
    });
  }, []);

  const reorderFilters = (sourceIndex: string, TargetIndex: string) => {
    const newConditions = [...filters.conditions];
    const [removed] = newConditions.splice(parseInt(sourceIndex), 1);
    newConditions.splice(parseInt(TargetIndex), 0, removed);
    configActions.alterFilters({ conditions: newConditions });
  };

  return (
    <div>
      {filters.conditions.map((condition, index) => {
        /** Recursive component */
        return (
          <DnDComponent
            id={`${index}`}
            index={index}
            lambda={reorderFilters}
            dataLabel={"dbfolderFiltersOrder"}
          >
            <GroupFilterComponent
              group={condition as FilterGroupCondition}
              recursiveIndex={[index]}
              level={0}
              table={table}
              possibleColumns={possibleColumns}
              key={`div-groupFilterComponent-${index}`}
            />
          </DnDComponent>
        );
      })}
    </div>
  );
};

export default DataviewFiltersComponent;
