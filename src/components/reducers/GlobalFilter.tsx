import React from "react";
import "regenerator-runtime/runtime";
import { useAsyncDebounce } from "react-table";
import { StyleVariables } from "helpers/Constants";

type GlobalFilterProps = {
  preGlobalFilteredRows: any;
  setGlobalFilter: any;
  globalFilter: any;
};
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
        style={{
          fontSize: "1.1rem",
          border: "0",
          background: StyleVariables.BACKGROUND_PRIMARY,
          color: StyleVariables.TEXT_NORMAL,
        }}
      />
    </span>
  );
}
