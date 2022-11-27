import React, { useEffect } from "react";
import { NavBarProps } from "cdm/MenuBarModel";
import GlobalFilter from "components/reducers/GlobalFilter";
import { StyleVariables } from "helpers/Constants";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { c } from "helpers/StylesHelper";
import EditFiltersButton from "components/reducers/DataviewFilters";
import AppBar from "@mui/material/AppBar";
import ToggleFiltersButton from "components/reducers/ToggleFiltersButton";
import Paper from "@mui/material/Paper";
import QuickFilters from "components/reducers/QuickFilters";

export function NavBar(navBarProps: NavBarProps) {
  const { table } = navBarProps;
  const { view, tableState } = table.options.meta;
  const isNavbarEnabled = tableState.configState(
    (state) => state.ephimeral.enable_navbar
  );

  // Control
  useEffect(() => {
    if (!view.statusBarItems.hits) {
      view.statusBarItems.hits = view.plugin.addStatusBarItem();
    }
    view.statusBarItems.hits.replaceChildren();
    view.statusBarItems.hits.createEl("span", {
      text: `${table.getFilteredRowModel().rows.length}/${view.rows.length} '${
        view.diskConfig.yaml.name
      }'`,
    });
  }, [table.getFilteredRowModel().rows.length]);

  return (
    <Box
      sx={{ flexGrow: 1 }}
      style={{
        width: "100%",
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
        <Toolbar className={`${c("toolbar-navbar")}`}>
          <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              scale: 0.7,
              padding: 0,
              boxShadow: "none",
              backgroundColor: "transparent",
            }}
          >
            {/** Global filter */}
            {isNavbarEnabled && (
              <GlobalFilter {...navBarProps.globalFilterRows} />
            )}
            <ToggleFiltersButton table={table} />
            <EditFiltersButton table={table} />
          </Paper>
          <Box
            sx={{
              overflowX: "auto",
              display: "flex",
              padding: { xs: "0", md: "5px" },
              width: "100%",
            }}
          >
            <QuickFilters table={table} key={`ButtonGroup-QuickFilters`} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export function HeaderNavBar(headerNavBarProps: NavBarProps) {
  const { table } = headerNavBarProps;
  const { tableState } = table.options.meta;
  const isNavbarEnabled = tableState.configState(
    (state) => state.ephimeral.enable_navbar
  );

  return (
    <div
      className={`${c("navbar")}`}
      key="div-navbar-header-cell"
      style={{
        display: isNavbarEnabled ? "flex" : "none",
      }}
    >
      <NavBar {...headerNavBarProps} />
    </div>
  );
}
