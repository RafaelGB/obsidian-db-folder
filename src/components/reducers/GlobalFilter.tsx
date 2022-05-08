import React from "react";
import "regenerator-runtime/runtime";
import { useAsyncDebounce } from "react-table";
import { StyleVariables } from "helpers/Constants";
import { GlobalFilterProps } from "cdm/MenuBarModel";

/**
 * Filter component based on react-table.
 * used to filter the data based on the search text.
 * @param globalFilterProps
 * @returns
 */
export default function GlobalFilter(globalFilterProps: GlobalFilterProps) {
  // TODO add typing to props
  const { preGlobalFilteredRows, globalFilter, setGlobalFilter } =
    globalFilterProps;
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        type={"search"}
      />
    </span>
  );
}
