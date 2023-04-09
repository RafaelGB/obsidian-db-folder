import React from "react";
import { FilterGroupCondition } from "cdm/SettingsModel";
import DnDComponent from "components/behavior/DnDComponent";
import GroupFilterComponent from "./GroupFilterComponent";
import { DataviewFiltersProps } from "../model/FiltersModel";

const DataviewFiltersComponent = (props: DataviewFiltersProps) => {
  const { table, possibleColumns } = props;
  const { tableState } = table.options.meta;
  const configActions = tableState.configState((state) => state.actions);
  const filters = tableState.configState((state) => state.filters);

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
