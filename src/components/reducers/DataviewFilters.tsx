import { FiltersModal } from "@features/filters";
import {
  ColumnFilterOption,
  TableFiltersProps,
} from "@features/filters/model/FiltersModel";
import { obtainColumnsFromRows } from "components/Columns";
import MenuDownIcon from "components/img/MenuDownIcon";
import {
  EMITTERS_GROUPS,
  EMITTERS_SHORTCUT,
  InputType,
} from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import React, { useEffect } from "react";

export default function EditFiltersButton(props: TableFiltersProps) {
  const { table } = props;
  const { tableState, view } = table.options.meta;
  const [configInfo, filters] = tableState.configState((state) => [
    state.info,
    state.filters,
  ]);
  const columns = tableState.columns((state) => state.columns);

  const obtainPossibleColumns = async (): Promise<ColumnFilterOption[]> => {
    const emptyFilterConditions = { ...filters };
    const allColumns = await obtainColumnsFromRows(
      view.file.parent.path,
      configInfo.getLocalSettings(),
      emptyFilterConditions,
      columns
    );

    const columnOptions: ColumnFilterOption[] = [];
    allColumns.forEach((column) => {
      const possibleColumn = columns.find(
        (dbColumn) => dbColumn.key === column
      );

      columnOptions.push({
        enabled: possibleColumn !== undefined,
        key: column,
        type: possibleColumn ? possibleColumn.input : InputType.TEXT,
      });
    });
    return columnOptions.sort((a, b) => a.key.localeCompare(b.key));
  };

  const openFiltersGroupHandler = async () => {
    new FiltersModal({
      table,
      possibleColumns: await obtainPossibleColumns(),
    }).open();
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
