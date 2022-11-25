import { DataviewFiltersProps } from "cdm/ComponentsModel";
import FilterOffIcon from "components/img/FilterOffIcon";
import FilterOnIcon from "components/img/FilterOnIcon";
import { c } from "helpers/StylesHelper";
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
    <button
      type="button"
      onClick={enableFilterHandler}
      key={`Button-Enabled-DataviewFilters`}
      className={c("nabvar-button")}
    >
      <span className="svg-icon svg-gray">
        {filters.enabled ? <FilterOnIcon /> : <FilterOffIcon />}
      </span>
    </button>
  );
}
