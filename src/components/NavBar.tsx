import * as React from "react";
import CsvWriter from "components/navbar/CsvWriter";
import MenuIcon from "components/img/MenuIcon";
import { NavBarProps } from "cdm/MenuBarModel";
import GlobalFilter from "components/reducers/GlobalFilter";
import PaginationTable from "components/navbar/PaginationTable";
import { InputType, NavBarConfig, StyleVariables } from "helpers/Constants";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SettingsIcon from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Toolbar from "@mui/material/Toolbar";
import { c } from "helpers/StylesHelper";
import DataviewFilters from "components/reducers/DataviewFilters";
import { MenuButtonStyle } from "components/styles/NavBarStyles";
import { SettingsModal } from "Settings";
import CsvReader from "./navbar/CsvReader";
import { t } from "lang/helpers";
import Grid from "@mui/material/Grid";

export function NavBar(navBarProps: NavBarProps) {
  const { table } = navBarProps;
  const { view, tableState } = table.options.meta;
  const columnsInfo = tableState.columns((state) => state.info);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClick = () => {
    setAnchorEl(null);
    new SettingsModal(
      view,
      {
        onSettingsChange: (settings) => {
          /**
           * Settings are saved into the database file, so we don't need to do anything here.
           */
        },
      },
      view.plugin.settings
    ).open();
  };

  const handleOpenAsMarkdownClick = () => {
    setAnchorEl(null);
    view.plugin.databaseFileModes[(view.leaf as any).id || view.file.path] =
      InputType.MARKDOWN;
    view.plugin.setMarkdownView(view.leaf);
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
          <Grid container spacing={3}>
            <Grid item xs="auto">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label={t("toolbar_menu_aria_label")}
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  maxHeight: NavBarConfig.ITEM_HEIGHT * 4.5,
                },
              }}
              MenuListProps={{
                "aria-labelledby": "long-button",
                style: {
                  backgroundColor: StyleVariables.BACKGROUND_PRIMARY,
                  color: StyleVariables.TEXT_NORMAL,
                },
              }}
            >
              <MenuItem onClick={handleSettingsClick} disableRipple>
                <SettingsIcon {...MenuButtonStyle} />
                {t("menu_pane_open_db_settings_action")}
              </MenuItem>
              <MenuItem onClick={handleOpenAsMarkdownClick} disableRipple>
                <InsertDriveFileIcon {...MenuButtonStyle} />
                {t("menu_pane_open_as_md_action")}
              </MenuItem>
              <MenuItem disableRipple>
                {/* CSV buttton download */}
                <CsvWriter
                  columns={columnsInfo.getAllColumns()}
                  rows={table.getRowModel().rows}
                  name={view.diskConfig.yaml.name}
                />
              </MenuItem>
              <CsvReader {...navBarProps} />
            </Menu>
            <Grid item xs="auto">
              {/** Global filter */}
              <GlobalFilter {...navBarProps.globalFilterRows} />
            </Grid>
            <Grid item xs="auto">
              <DataviewFilters table={table} />
            </Grid>
            <Grid item xs="auto">
              <PaginationTable table={table} />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {/** Hacky to stick the bar without move one row before the header*/}
      <Toolbar
        style={{
          opacity: 0,
          pointerEvents: "none",
        }}
      />
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
