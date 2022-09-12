import { Button, ButtonGroup } from "@mui/material";
import { DataviewFiltersProps } from "cdm/ComponentsModel";
import FilterOffIcon from "components/img/FilterOffIcon";
import FilterOnIcon from "components/img/FilterOnIcon";
import DataviewFiltersPortal from "components/portals/DataviewFiltersPortal";
import React from "react";

export default function DataviewFilters(props: DataviewFiltersProps) {
  const { table } = props;
  const { tableState } = table.options.meta;
  const [configInfo, filters, filterActions] = tableState.configState(
    (state) => [state.info, state.filters, state.actions]
  );
  const columns = tableState.columns((state) => state.columns);
  const dataActions = tableState.data((state) => state.actions);
  const enableFilterHandler = () => {
    // Invert the filter state
    const alteredFilterState = { ...filters };
    alteredFilterState.enabled = !alteredFilterState.enabled;
    filterActions.alterFilters(alteredFilterState);
    dataActions.dataviewRefresh(
      columns,
      configInfo.getLocalSettings(),
      alteredFilterState
    );
  };

  return (
    <ButtonGroup
      variant="text"
      size="small"
      key={`ButtonGroup-DataviewFilters`}
    >
      <Button
        size="small"
        onClick={enableFilterHandler}
        key={`Button-Enabled-DataviewFilters`}
      >
        <span className="svg-icon svg-gray" style={{ marginRight: 8 }}>
          {filters.enabled ? <FilterOnIcon /> : <FilterOffIcon />}
        </span>
      </Button>
      <DataviewFiltersPortal table={table} />
    </ButtonGroup>
  );
}
