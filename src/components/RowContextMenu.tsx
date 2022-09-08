import IconButton from "@mui/material/IconButton";
import { TableColumn } from "cdm/FolderModel";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  DEFAULT_COLUMN_CONFIG,
  InputType,
  MetadataDatabaseColumns,
} from "helpers/Constants";
import React from "react";
import { showFileMenu } from "./obsidianArq/commands";

const rowContextMenuColumn: TableColumn = {
  ...MetadataDatabaseColumns.ROW_CONTEXT_MENU,
  input: InputType.TEXT,
  config: DEFAULT_COLUMN_CONFIG,
  position: 0,
  header: () => null,
  cell: ({ row, table }) => {
    const { tableState } = table.options.meta;
    const rowActions = tableState.data((state) => state.actions);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleDeleteRow = () => {
      rowActions.removeRow(row.original);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      row.getToggleSelectedHandler()({
        event: {
          target: {
            checked: !row.getIsSelected(),
          },
        },
      });
      setAnchorEl(event.currentTarget);

      showFileMenu(
        row.original.__note__.getFile(),
        event.nativeEvent,
        handleDeleteRow
      );
    };

    return (
      <>
        <IconButton
          size="small"
          edge="start"
          color="inherit"
          aria-label="Open row context menu"
          id={`row-context-button-${row.id}`}
          aria-controls={open ? `row-context-button-${row.id}` : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          sx={{ border: 0, borderRadius: 0 }}
          onClick={handleClick}
          key={`row-context-button-${row.id}`}
        >
          <DragIndicatorIcon />
        </IconButton>
      </>
    );
  },
};
export default rowContextMenuColumn;
