import { Button, ButtonGroup } from "@mui/material";
import { Table } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import FilterOffIcon from "components/img/FilterOffIcon";
import FilterOnIcon from "components/img/FilterOnIcon";
import MenuDownIcon from "components/img/MenuDownIcon";
import PlusIcon from "components/img/Plus";
import DataviewFiltersPortal from "components/portals/DataviewFiltersPortal";
import React from "react";

export default function DataviewFilters(props: { table: Table<RowDataType> }) {
  const { table } = props;
  const { view, tableState } = table.options.meta;
  const [ddbbConfig, filters, filterActions] = tableState.configState(
    (state) => [state.ddbbConfig, state.filters, state.actions]
  );
  const columns = tableState.columns((state) => state.columns);
  const dataActions = tableState.data((state) => state.actions);
  const enableFilterHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Invert the filter state
    const alteredFilterState = { ...filters };
    alteredFilterState.enabled = !alteredFilterState.enabled;
    filterActions.alterFilters(alteredFilterState);
    dataActions.dataviewRefresh(columns, ddbbConfig, alteredFilterState);
  };

  return (
    <ButtonGroup variant="text" size="small">
      <Button size="small">
        <span className="svg-icon svg-gray" style={{ marginRight: 8 }}>
          <PlusIcon />
        </span>
      </Button>
      <Button size="small" onClick={enableFilterHandler}>
        <span className="svg-icon svg-gray" style={{ marginRight: 8 }}>
          {filters.enabled ? <FilterOnIcon /> : <FilterOffIcon />}
        </span>
      </Button>
      <DataviewFiltersPortal />
    </ButtonGroup>
  );
}
