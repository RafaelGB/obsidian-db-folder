import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { TableColumn } from "cdm/FolderModel";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DEFAULT_COLUMN_CONFIG,
  InputType,
  MetadataDatabaseColumns,
} from "helpers/Constants";
import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const rowContextMenuColumn: TableColumn = {
  ...MetadataDatabaseColumns.ROW_CONTEXT_MENU,
  input: InputType.TEXT,
  config: DEFAULT_COLUMN_CONFIG,
  position: 0,
  header: ({ table }) => null,
  cell: ({ row, table }) => {
    const { tableState } = table.options.meta;
    const [hoveredRow, rowActions] = tableState.data((state) => [
      state.hoveredRow,
      state.actions,
    ]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      row.getToggleSelectedHandler()({
        event: {
          target: {
            checked: !row.getIsSelected(),
          },
        },
      });
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
      row.getToggleSelectedHandler()({
        event: {
          target: {
            checked: !row.getIsSelected(),
          },
        },
      });
    };

    const handleDeleteRow = () => {
      rowActions.removeRow(row.original);
    };

    return hoveredRow === row.id ? (
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
          onClick={handleClick}
        >
          <DragIndicatorIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id={`row-context-menu-${row.id}`}
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: "left", vertical: "top" }}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          <MenuItem onClick={handleDeleteRow}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>
      </>
    ) : null;
  },
};

export default rowContextMenuColumn;
