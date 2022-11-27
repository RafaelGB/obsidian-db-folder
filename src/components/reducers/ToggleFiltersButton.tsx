import { DataviewFiltersProps } from "cdm/ComponentsModel";
import FilterOffIcon from "components/img/FilterOffIcon";
import FilterOnIcon from "components/img/FilterOnIcon";
import { EMITTERS_GROUPS, EMITTERS_SHORTCUT } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import React, { useEffect, useRef } from "react";

export default function ToggleFiltersButton(props: DataviewFiltersProps) {
  const { table } = props;
  const { tableState, view } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);
  const filterActions = tableState.configState((state) => state.actions);
  const areFiltersEnabled = tableState.configState(
    (state) => state.filters.enabled
  );
  const columns = tableState.columns((state) => state.columns);
  const dataActions = tableState.data((state) => state.actions);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const enableFilterHandler = async () => {
    // Invert the filter state
    await filterActions.alterFilters({
      enabled: !areFiltersEnabled,
    });

    await dataActions.dataviewRefresh(
      columns,
      configInfo.getLocalSettings(),
      configInfo.getFilters()
    );
  };

  /**
   * Keyboard shortcut
   */
  useEffect(() => {
    const toggleFilterShortcutHandler = (commandId: string) => {
      if (commandId === EMITTERS_SHORTCUT.TOGGLE_FILTERS) {
        console.log("Toggle filters");
        buttonRef.current?.click();
      }
    };
    view.emitter.on(EMITTERS_GROUPS.SHORTCUT, toggleFilterShortcutHandler);
    return () => {
      view.emitter.off(EMITTERS_GROUPS.SHORTCUT, toggleFilterShortcutHandler);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={enableFilterHandler}
      key={`Button-Enabled-DataviewFilters`}
      className={c("nabvar-button")}
      ref={buttonRef}
    >
      <span className="svg-icon svg-gray">
        {areFiltersEnabled ? <FilterOnIcon /> : <FilterOffIcon />}
      </span>
    </button>
  );
}
