import Button from "@mui/material/Button";
import { HeaderContext } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { Literal } from "obsidian-dataview";
import React from "react";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { MenuButtonStyle } from "components/styles/NavBarStyles";

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
    configActions.alterEphimeral({
      enable_columns_filter: !columnsFilterAreEnabled,
    });
  };
  return (
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
