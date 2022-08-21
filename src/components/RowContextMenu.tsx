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
import React, { HTMLProps } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const rowContextMenuColumn: TableColumn = {
  ...MetadataDatabaseColumns.ROW_CONTEXT_MENU,
  input: InputType.TEXT,
  config: DEFAULT_COLUMN_CONFIG,
  position: 0,
  header: ({ table }) => {
    const { tableState } = table.options.meta;
    return (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    );
  },
  cell: ({ row, table }) => {
    const { tableState } = table.options.meta;
    const [hoveredRow, rowActions] = tableState.data((state) => [
      state.hoveredRow,
      state.actions,
    ]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleDeleteRow = () => {
      rowActions.removeRow(row.original);
    };
    return hoveredRow === row.index ? (
      <>
        <IconButton
          size="small"
          edge="start"
          color="inherit"
          aria-label="Open table options"
          sx={{ mr: 2 }}
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <DragIndicatorIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleDeleteRow}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>
      </>
    ) : // <div className="px-1">
    //   <IndeterminateCheckbox
    //     {...{
    //       checked: row.getIsSelected(),
    //       indeterminate: row.getIsSomeSelected(),
    //       onChange: row.getToggleSelectedHandler(),
    //     }}
    //   />
    // </div>
    null;
  },
};

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

export default rowContextMenuColumn;
