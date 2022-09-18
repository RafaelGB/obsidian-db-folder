import { Button, ButtonGroup } from "@mui/material";
import { DataviewFiltersProps } from "cdm/ComponentsModel";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { obtainColumnsFromRows } from "components/Columns";
import FilterOffIcon from "components/img/FilterOffIcon";
import FilterOnIcon from "components/img/FilterOnIcon";
import MenuDownIcon from "components/img/MenuDownIcon";
import MenuUpIcon from "components/img/MenuUpIcon";
import { FiltersModal } from "components/modals/filters/FiltersModal";
import DataviewFiltersPortal from "components/portals/DataviewFiltersPortal";
import React from "react";

export default function DataviewFilters(props: DataviewFiltersProps) {
  const { table } = props;
  const { tableState, view } = table.options.meta;
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

  const openFiltersGroupHandler = () => {
    new Promise<Record<string, DatabaseColumn>>((resolve, reject) => {
      // Empty conditions to refresh the dataview
      const emptyFilterConditions = { ...filters };
      emptyFilterConditions.conditions = [];
      resolve(
        obtainColumnsFromRows(
          view,
          configInfo.getLocalSettings(),
          emptyFilterConditions,
          columns
        )
      );
    }).then((columns) => {
      new FiltersModal({
        table,
        possibleColumns: Object.keys(columns).sort((a, b) =>
          a.localeCompare(b)
        ),
      }).open();
    });
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
      <Button
        size="small"
        onClick={openFiltersGroupHandler}
        key={`Button-FilterConditions-DataviewFilters`}
      >
        <span
          className="svg-icon svg-gray"
          style={{ marginRight: 8 }}
          key={`Span-FilterConditions-Ref-Portal`}
        >
          <div key={`Div-FilterConditions-Ref-Portal`}>
            <MenuUpIcon />
          </div>
        </span>
      </Button>
    </ButtonGroup>
  );
}
