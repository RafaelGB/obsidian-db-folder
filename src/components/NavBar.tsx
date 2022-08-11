import * as React from "react";
import CsvButton from "components/CsvButton";
import { NavBarProps } from "cdm/MenuBarModel";
import GlobalFilter from "components/reducers/GlobalFilter";
import { NavBarConfig, StyleVariables } from "helpers/Constants";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import { c } from "helpers/StylesHelper";
import MenuIcon from "components/img/MenuIcon";
import PlusIcon from "components/img/Plus";
import FilterOnIcon from "components/img/FilterOnIcon";
import MenuDownIcon from "components/img/MenuDownIcon";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";

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

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      onBlur={handleMenuClose}
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
  );
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{
          color: StyleVariables.TEXT_MUTED,
          backgroundColor: StyleVariables.BACKGROUND_SECONDARY,
          width: "calc(100% - 20px)",
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
          {renderMenu}
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
          <ButtonGroup variant="text" size="small">
            <Button size="small">
              <span className="svg-icon svg-gray" style={{ marginRight: 8 }}>
                <PlusIcon />
              </span>
            </Button>
            <Button size="small">
              <span className="svg-icon svg-gray" style={{ marginRight: 8 }}>
                <FilterOnIcon />
              </span>
            </Button>
            <Button size="small">
              <span className="svg-icon svg-gray" style={{ marginRight: 8 }}>
                <MenuDownIcon />
              </span>
            </Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export function HeaderNavBar(headerNavBarProps: NavBarProps) {
  const { table } = headerNavBarProps;
  return (
    <div
      key="div-navbar-header-row"
      className={`${c("tr")}`}
      style={{
        width: table.getCenterTotalSize(),
      }}
    >
      <div className={`${c("th navbar")}`} key="div-navbar-header-cell">
        <NavBar {...headerNavBarProps} />
      </div>
    </div>
  );
}
