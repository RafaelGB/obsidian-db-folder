import { DataviewFiltersProps } from "cdm/ComponentsModel";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { obtainColumnsFromRows } from "components/Columns";
import React, { useState } from "react";
import { FilterGroupCondition } from "cdm/SettingsModel";
import GroupFilterComponent from "components/modals/filters/handlers/GroupFilterComponent";

const DataviewFiltersComponent = (props: DataviewFiltersProps) => {
  const { table } = props;
  const { tableState, view } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);
  const filters = tableState.configState((state) => state.filters);
  const columnsInfo = tableState.columns((state) => state.info);

  const [possibleColumns, setPossibleColumns] = useState([] as string[]);

  React.useEffect(() => {
    new Promise<Record<string, DatabaseColumn>>((resolve, reject) => {
      // Empty conditions to refresh the dataview
      const emptyFilterConditions = { ...filters };
      emptyFilterConditions.conditions = [];
      resolve(
        obtainColumnsFromRows(
          view,
          configInfo.getLocalSettings(),
          emptyFilterConditions,
          columnsInfo.getAllColumns()
        )
      );
    }).then((columns) => {
      setPossibleColumns(
        Object.keys(columns).sort((a, b) => a.localeCompare(b))
      );
    });
  }, []);

  return (
    <div>
      {filters.conditions.map((condition, index) => {
        /** Recursive component */
        return (
          <GroupFilterComponent
            group={condition as FilterGroupCondition}
            recursiveIndex={[index]}
            level={0}
            table={table}
            possibleColumns={possibleColumns}
            key={`div-groupFilterComponent-${index}`}
          />
        );
      })}
    </div>
  );
};

export default DataviewFiltersComponent;
