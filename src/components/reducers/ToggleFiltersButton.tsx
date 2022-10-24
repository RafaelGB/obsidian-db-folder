import { Button } from "@mui/material";
import { DataviewFiltersProps } from "cdm/ComponentsModel";
import FilterOffIcon from "components/img/FilterOffIcon";
import FilterOnIcon from "components/img/FilterOnIcon";
import React from "react";

export default function ToggleFiltersButton(props: DataviewFiltersProps) {
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
    <Button
      size="small"
      onClick={enableFilterHandler}
      key={`Button-Enabled-DataviewFilters`}
      style={{ minWidth: "0px", padding: "2px", borderRadius: "0px" }}
    >
      <span className="svg-icon svg-gray">
        {filters.enabled ? <FilterOnIcon /> : <FilterOffIcon />}
      </span>
    </Button>
  );
}
