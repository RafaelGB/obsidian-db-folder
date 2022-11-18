import { DatabaseHeaderProps, TableColumn } from "cdm/FolderModel";
import { DynamicDebouncedInput } from "components/behavior/DebouncedInputFn";
import React from "react";

/** Filters in function of input type */
export function TextFilter(headerProps: DatabaseHeaderProps) {
  const { column } = headerProps;

  const sortedUniqueValues = React.useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return (
    <>
      <datalist id={`${column.id}-list`}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DynamicDebouncedInput
        type="text"
        value={(column.getFilterValue() ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={`${column.id}-list`}
        style={{
          width: "100%",
        }}
      />
      <div className="h-1" />
    </>
  );
}
