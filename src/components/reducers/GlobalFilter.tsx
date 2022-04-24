import React from "react";
import "regenerator-runtime/runtime";
import { useAsyncDebounce } from "react-table";

/**
 * Filter component based on react-table.
 * used to filter the data based on the search text.
 * @param globalFilterProps
 * @returns
 */
export default function GlobalFilter(globalFilterProps: any) {
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
        style={{
          fontSize: "1.1rem",
          border: "0",
          background: "var(--background-primary)",
          color: "var(--text-normal)",
        }}
      />
    </span>
  );
}
