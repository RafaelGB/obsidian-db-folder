import * as React from "react";
import CsvButton from "components/CsvButton";
import { CsvButtonProps, GlobalFilterProps } from "cdm/MenuBarModel";
import GlobalFilter from "components/reducers/GlobalFilter";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@material-ui/core";
import { TableHeaderProps } from "react-table";
import { c } from "helpers/StylesHelper";
import MenuIcon from "components/img/MenuIcon";

type NavBarProps = {
  csvButtonProps: CsvButtonProps;
  globalFilterRows: GlobalFilterProps;
  headerGroupProps?: TableHeaderProps;
};

export function NavBar(navBarProps: NavBarProps) {
  const [menuEl, setMenuEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuEl);
  const handleMenuClose = () => {
    setMenuEl(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuEl(event.currentTarget);
  };
  return (
    <Box
      sx={{ flexGrow: 1 }}
      style={{
        top: 0,
        alignSelf: "flex-start",
        zIndex: 1,
      }}
    >
      <AppBar
        position="static"
        style={{ backgroundColor: "var(--background-modifier-box-shadow)" }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={menuEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            onBlur={handleMenuClose}
            PaperProps={{
              elevation: 0,
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
          >
            <MenuItem>
              {/* CSV buttton download */}
              <CsvButton {...navBarProps.csvButtonProps} />
            </MenuItem>
          </Menu>
          {/** Global filter */}
          <GlobalFilter {...navBarProps.globalFilterRows} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export function HeaderNavBar(props: NavBarProps) {
  return (
    <div
      key="div-navbar-header-row"
      className={`${c("tr navbar")}`}
      {...props.headerGroupProps}
    >
      <div className={`${c("th navbar")}`} key="div-navbar-header-cell">
        <NavBar {...props} />
      </div>
    </div>
  );
}
