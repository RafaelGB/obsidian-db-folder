import { HeaderContext } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { Literal } from "obsidian-dataview";
import React, { useEffect } from "react";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { MenuButtonStyle } from "components/styles/NavBarStyles";
import { c } from "helpers/StylesHelper";
import { ContextMenuAction, EMITTERS_GROUPS } from "helpers/Constants";
import { ContextHeaderData } from "cdm/EmitterModel";
import showHeaderContextMenu from "components/obsidianArq/menu/headerContextMenu";

export default function HeaderContextMenu(
  context: HeaderContext<RowDataType, Literal>
) {
  const { table } = context;
  const { tableState, view } = table.options.meta;

  const contextState = tableState.configState(
    (state) => state.ephimeral.context_header
  );
  const configActions = tableState.configState((state) => state.actions);
  const columnsFilterAreEnabled = tableState.configState(
    (state) => state.ephimeral.enable_columns_filter
  );

  const rowActions = tableState.data((state) => state.actions);

  const enableColumnsFilterHandler = () => {
    // Invert the columns filter state
    const newColumnsFilterState = !columnsFilterAreEnabled;
    configActions.alterEphimeral({
      enable_columns_filter: newColumnsFilterState,
    });

    // If the columns filter is disabled, remove all the filters
    if (!newColumnsFilterState) {
      table.resetColumnFilters();
    }
  };

  const toggleAllRowsSelection = () => {
    table.toggleAllPageRowsSelected(!table.getIsAllPageRowsSelected());
  };

  const SelectActionView = () => (
    <div className={`${c("checkbox")}`}>
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        key={`header-context-button`}
        onChange={toggleAllRowsSelection}
      />
    </div>
  );

  const DefaultActionView = () => {
    return (
      <span
        className="svg-icon svg-gray"
        onClick={enableColumnsFilterHandler}
        key={`Button-Enabled-DataviewFilters`}
      >
        {columnsFilterAreEnabled ? (
          <SearchOffIcon {...MenuButtonStyle} fontSize="small" />
        ) : (
          <ManageSearchIcon {...MenuButtonStyle} fontSize="small" />
        )}
      </span>
    );
  };

  const ActionView = () => {
    switch (contextState.action) {
      case "select":
        return <SelectActionView />;
      default:
        return <DefaultActionView />;
    }
  };

  useEffect(() => {
    const onHotkey = (data: ContextHeaderData) => {
      // Update the context header state
      configActions.alterEphimeral({
        context_header: data,
      });
      // Do nothing if the option is undefined
      if (data.option === undefined) return;

      switch (data.action) {
        case ContextMenuAction.SELECT:
          rowActions.bulkRowUpdate(
            table.getSelectedRowModel().rows.map((row) => row.original),
            data.option
          );
        default:
        // Do nothing
      }
    };

    view.emitter.on(EMITTERS_GROUPS.CONTEXT_HEADER, onHotkey);

    return () => {
      view.emitter.off(EMITTERS_GROUPS.CONTEXT_HEADER, onHotkey);
    };
  }, []);

  return (
    <div
      className={c("header-menu")}
      onContextMenu={(event) => {
        showHeaderContextMenu(event.nativeEvent, contextState, view.emitter);
      }}
      key={`Header-Context-Dropdown-Button`}
    >
      {/** Current Action View */}
      <ActionView key={`Action-view-${contextState.action}`} />
    </div>
  );
}
