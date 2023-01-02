import { DataviewFiltersProps } from "cdm/ComponentsModel";
import { obtainColumnsFromRows } from "components/Columns";
import MenuDownIcon from "components/img/MenuDownIcon";
import { FiltersModal } from "components/modals/filters/FiltersModal";
import { EMITTERS_GROUPS, EMITTERS_SHORTCUT } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import React, { useEffect } from "react";

export default function EditFiltersButton(props: DataviewFiltersProps) {
  const { table } = props;
  const { tableState, view } = table.options.meta;
  const [configInfo, filters] = tableState.configState((state) => [
    state.info,
    state.filters,
    state.actions,
  ]);
  const columns = tableState.columns((state) => state.columns);

  const openFiltersGroupHandler = async () => {
    new Promise<string[]>((resolve, reject) => {
      // Empty conditions to refresh the dataview
      const emptyFilterConditions = { ...filters };
      emptyFilterConditions.conditions = [];
      resolve(
        obtainColumnsFromRows(
          view.file.parent.path,
          configInfo.getLocalSettings(),
          emptyFilterConditions,
          columns
        )
      );
    }).then((columns) => {
      new FiltersModal({
        table,
        possibleColumns: columns.sort((a, b) => a.localeCompare(b)),
      }).open();
    });
  };

  /**
   * Keyboard shortcut
   */
  useEffect(() => {
    const openFilterShortcutHandler = (commandId: string) => {
      if (commandId === EMITTERS_SHORTCUT.OPEN_FILTERS) {
        openFiltersGroupHandler();
      }
    };
    view.emitter.on(EMITTERS_GROUPS.SHORTCUT, openFilterShortcutHandler);
    return () => {
      view.emitter.off(EMITTERS_GROUPS.SHORTCUT, openFilterShortcutHandler);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={openFiltersGroupHandler}
      key={`Button-FilterConditions-DataviewFilters`}
      className={c("nabvar-button")}
    >
      <span
        className="svg-icon svg-gray"
        key={`Span-FilterConditions-Ref-Portal`}
      >
        <MenuDownIcon />
      </span>
    </button>
  );
}
