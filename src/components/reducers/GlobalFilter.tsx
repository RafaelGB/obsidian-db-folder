import React from "react";
import "regenerator-runtime/runtime";
import { GlobalFilterProps } from "cdm/MenuBarModel";
import {
  Search,
  SearchIconWrapper,
} from "components/styles/NavBarSearchStyles";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  placeholder,
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <InputBase
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
    />
  );
}

/**
 * Filter component based on react-table.
 * used to filter the data based on the search text.
 * @param globalFilterProps
 * @returns
 */
export default function GlobalFilter(globalFilterProps: GlobalFilterProps) {
  const { hits, globalFilter, setGlobalFilter } = globalFilterProps;

  const CustomDebouncedInput = styled(DebouncedInput)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <CustomDebouncedInput
        value={globalFilter ?? ""}
        onChange={(value) => setGlobalFilter(String(value))}
        placeholder={`Search... (${hits})`}
      />
    </Search>
  );
}
