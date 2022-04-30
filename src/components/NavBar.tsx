import * as React from "react";
import CsvButton from "components/CsvButton";
import { CsvButtonProps, GlobalFilterProps } from "cdm/MenuBarModel";
import GlobalFilter from "components/reducers/GlobalFilter";
import { AppBar, Box, TableCell, TableRow, Toolbar } from "@material-ui/core";
import { TableHeaderProps } from "react-table";
import { c } from "helpers/StylesHelper";

// const Search = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   "&:hover": {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginLeft: 0,
//   width: "100%",
//   [theme.breakpoints.up("sm")]: {
//     marginLeft: theme.spacing(1),
//     width: "auto",
//   },
// }));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "inherit",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create("width"),
//     width: "100%",
//     [theme.breakpoints.up("sm")]: {
//       width: "12ch",
//       "&:focus": {
//         width: "20ch",
//       },
//     },
//   },
// }));

type NavBarProps = {
  csvButtonProps: CsvButtonProps;
  globalFilterRows: GlobalFilterProps;
  headerGroupProps?: TableHeaderProps;
};
export function NavBar(navBarProps: NavBarProps) {
  return (
    <Box
      sx={{ flexGrow: 1 }}
      style={{
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        zIndex: 1,
      }}
    >
      <AppBar position="static">
        <Toolbar>
          {/* CSV buttton download */}
          <CsvButton {...navBarProps.csvButtonProps} />
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
