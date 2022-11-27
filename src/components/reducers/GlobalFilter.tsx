import React from "react";
import { GlobalFilterProps } from "cdm/MenuBarModel";
import { DebouncedInputWrapper, Search } from "components/styles/NavBarStyles";
import { GlobalDebouncedInput } from "components/behavior/DebouncedInputFn";

/**
 * Filter component based on react-table.
 * used to filter the data based on the search text.
 * @param globalFilterProps
 * @returns
 */
export default function GlobalFilter(globalFilterProps: GlobalFilterProps) {
  const { globalFilter, setGlobalFilter } = globalFilterProps;

  return (
    <Search>
      <DebouncedInputWrapper>
        <GlobalDebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search...`}
        />
      </DebouncedInputWrapper>
    </Search>
  );
}
