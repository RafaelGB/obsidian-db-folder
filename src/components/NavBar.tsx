import * as React from "react";
import CsvWriter from "components/navbar/CsvWriter";
import MenuIcon from "components/img/MenuIcon";
import { NavBarProps } from "cdm/MenuBarModel";
import GlobalFilter from "components/reducers/GlobalFilter";
import PaginationTable from "components/navbar/PaginationTable";
import { InputType, StyleVariables } from "helpers/Constants";
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
import AppBar from "@mui/material/AppBar";

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
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
      keepMounted
      id="long-button"
      MenuListProps={{
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
  );
  return (
    <Box
      sx={{ flexGrow: 1 }}
      style={{
        width: table.getCenterTotalSize(),
      }}
    >
      <AppBar
        position="sticky"
        style={{
          color: StyleVariables.TEXT_MUTED,
          backgroundColor: StyleVariables.BACKGROUND_SECONDARY,
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <IconButton
            size="medium"
            aria-label={t("toolbar_menu_aria_label")}
            aria-controls="long-button"
            aria-haspopup="true"
            onClick={handleClick}
            color="inherit"
            sx={{ mr: 2, maxWidth: 40 }}
          >
            <MenuIcon />
          </IconButton>

          {/** Global filter */}
          <GlobalFilter {...navBarProps.globalFilterRows} />
          <Box
            justifyContent={"flex-start"}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            <DataviewFilters table={table} />
            <PaginationTable table={table} />
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}
export function HeaderNavBar(headerNavBarProps: NavBarProps) {
  return (
    <div
      className={`${c("sticky-level-1 navbar")}`}
      key="div-navbar-header-cell"
    >
      <NavBar {...headerNavBarProps} />
    </div>
  );
}
