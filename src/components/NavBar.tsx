import * as React from "react";
import CsvButton from "components/CsvButton";
import MenuIcon from "components/img/MenuIcon";
import { NavBarProps } from "cdm/MenuBarModel";
import GlobalFilter from "components/reducers/GlobalFilter";
import PaginationTable from "components/PaginationTable";
import { NavBarConfig, StyleVariables } from "helpers/Constants";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import { c } from "helpers/StylesHelper";
import Typography from "@mui/material/Typography";
import DataviewFilters from "components/reducers/DataviewFilters";

export function NavBar(navBarProps: NavBarProps) {
  const { table } = navBarProps;
  const { view, tableState } = table.options.meta;
  const columns = tableState.columns((state) => state.columns);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{
          color: StyleVariables.TEXT_MUTED,
          backgroundColor: StyleVariables.BACKGROUND_SECONDARY,
          width: "calc(100% - 20px)",
          boxShadow: "none",
          position: "fixed",
          left: 0,
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
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
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                maxHeight: NavBarConfig.ITEM_HEIGHT * 4.5,
                width: "20ch",
              },
            }}
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
          >
            <MenuItem>
              {/* CSV buttton download */}
              <CsvButton
                columns={columns}
                rows={table.getRowModel().rows}
                name={view.diskConfig.yaml.name}
              />
            </MenuItem>
          </Menu>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {view.diskConfig.yaml.name}
          </Typography>
          {/** Global filter */}
          <GlobalFilter {...navBarProps.globalFilterRows} />
          <DataviewFilters table={table} />
          <PaginationTable table={table} />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}
export function HeaderNavBar(headerNavBarProps: NavBarProps) {
  const { table } = headerNavBarProps;
  return (
    <div
      key={`div-navbar-header-row`}
      className={`${c("tr sticky-level-1")}`}
      style={{
        width: table.getCenterTotalSize(),
      }}
    >
      <div
        className={`${c("th navbar sticky-level-1")}`}
        key="div-navbar-header-cell"
      >
        <NavBar {...headerNavBarProps} />
      </div>
    </div>
  );
}
