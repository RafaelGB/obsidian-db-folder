import React from "react";
import "regenerator-runtime/runtime";
import { GlobalFilterProps } from "cdm/MenuBarModel";

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
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
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
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
  // TODO add typing to props
  const { globalFilter, setGlobalFilter } = globalFilterProps;
  const [value, setValue] = React.useState(globalFilter);

  return (
    <span>
      Search:{" "}
      <DebouncedInput
        value={globalFilter ?? ""}
        onChange={(value) => setGlobalFilter(String(value))}
        className="p-2 font-lg shadow border border-block"
        placeholder="Search all columns..."
      />
    </span>
  );
}
