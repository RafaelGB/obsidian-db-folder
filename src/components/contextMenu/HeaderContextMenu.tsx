import { HeaderContext } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { Literal } from "obsidian-dataview";
import React from "react";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { MenuButtonStyle } from "components/styles/NavBarStyles";
import Stack from "@mui/material/Stack";
import { showHeaderContextMenu } from "components/obsidianArq/commands";
import { c } from "helpers/StylesHelper";

export default function HeaderContextMenu(
  context: HeaderContext<RowDataType, Literal>
) {
  const { table } = context;
  const { tableState } = table.options.meta;
  const configActions = tableState.configState((state) => state.actions);
  const columnsFilterAreEnabled = tableState.configState(
    (state) => state.ephimeral.enable_columns_filter
  );

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
  return table.getIsSomePageRowsSelected() ? (
    <Stack direction="row" spacing={2}>
      <input
        type="checkbox"
        className={`${c("checkbox")}`}
        checked={table.getIsAllPageRowsSelected()}
        key={`header-context-button`}
        onChange={toggleAllRowsSelection}
      />
      <span
        className="svg-icon svg-gray"
        onClick={(event) => showHeaderContextMenu(event.nativeEvent)}
        key={`Header-Context-Dropdown-Button`}
      >
        <ArrowDropDownCircleIcon {...MenuButtonStyle} fontSize="small" />
      </span>
    </Stack>
  ) : (
    <span
      className="svg-icon svg-gray"
      onClick={enableColumnsFilterHandler}
      key={`Button-Enabled-DataviewFilters`}
      style={{ width: "30px", height: "100%" }}
    >
      {columnsFilterAreEnabled ? (
        <SearchOffIcon {...MenuButtonStyle} fontSize="small" />
      ) : (
        <ManageSearchIcon {...MenuButtonStyle} fontSize="small" />
      )}
    </span>
  );
}
