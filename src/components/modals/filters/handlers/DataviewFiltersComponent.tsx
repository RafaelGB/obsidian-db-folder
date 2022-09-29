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
import GroupFilterComponent from "./GroupFilterComponent";

const DataviewFiltersComponent = (props: DataviewFiltersProps) => {
  const { table } = props;
  const { tableState, view } = table.options.meta;
  const [ddbbConfig] = tableState.configState((state) => [
    state.ddbbConfig,
    state.actions,
  ]);
  const configInfo = tableState.configState((state) => state.info);
  const columns = tableState.columns((state) => state.columns);

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

  return (
    <div>
      {configInfo.getFilters().conditions.map((condition, index) => {
        /** Recursive component */
        return GroupFilterComponent({
          group: condition as FilterGroupCondition,
          recursiveIndex: [index],
          level: 0,
          table: table,
          possibleColumns: possibleColumns,
        });
      })}
    </div>
  );
};

export default DataviewFiltersComponent;
