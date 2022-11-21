import { DatabaseHeaderProps } from "cdm/FolderModel";
import { DynamicDebouncedInput } from "components/behavior/DebouncedInputFn";
import DatePicker from "react-datepicker";
import React, { useState } from "react";
import { ChangeEventHandler } from "react";
import { StyleVariables } from "helpers/Constants";

/**
 * Filter input for text columns
 * @param headerProps
 * @returns
 */
export function BaseFilter(headerProps: DatabaseHeaderProps) {
  const { column } = headerProps;

  return (
    <>
      <DynamicDebouncedInput
        type="text"
        value={(column.getFilterValue() ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        style={{
          width: "100%",
        }}
      />
      <div className="h-1" />
    </>
  );
}

/**
 * Filter input with dropdown list with unique values
 * @param headerProps
 * @returns
 */
export function TextFilter(headerProps: DatabaseHeaderProps) {
  const { column } = headerProps;

  const sortedUniqueValues = React.useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return (
    <div key={`${column.id}-text-filter`}>
      <datalist id={`${column.id}-list`} key={`${column.id}-datalist`}>
        {sortedUniqueValues.slice(0, 5000).map((value, index) => (
          <option
            value={value?.toString()}
            key={`${column.id}-option-${index}`}
          />
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
    </div>
  );
}

export function NumberFilter(headerProps: DatabaseHeaderProps) {
  const { column } = headerProps;
  const min = Number(column.getFacetedMinMaxValues()?.[0] ?? undefined);
  const max = Number(column.getFacetedMinMaxValues()?.[1] ?? undefined);
  const minValue =
    (column.getFilterValue() as [number, number])?.[0] ?? undefined;
  const maxValue =
    (column.getFilterValue() as [number, number])?.[1] ?? undefined;
  return (
    <>
      <div className="flex space-x-2" key={`${column.id}-number-filter`}>
        <DynamicDebouncedInput
          type="number"
          min={min}
          max={max}
          value={minValue}
          onChange={(value) => {
            if (value === "" || value === null) {
              value = undefined;
            }
            column.setFilterValue((old: [number, number]) => [value, old?.[1]]);
          }}
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
          style={{
            width: "50%",
          }}
        />
        <DynamicDebouncedInput
          type="number"
          min={Number.isNaN(min) ? undefined : min}
          max={Number.isNaN(max) ? undefined : max}
          value={maxValue}
          onChange={(value) => {
            if (value === "" || value === null) {
              value = undefined;
            }
            column.setFilterValue((old: [number, number]) => [old?.[0], value]);
          }}
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
          style={{
            width: "50%",
          }}
        />
      </div>
      <div className="h-1" />
    </>
  );
}

export function DateRangeFilter(headerProps: DatabaseHeaderProps) {
  const { column } = headerProps;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <>
      <div
        style={{
          display: "flex",
        }}
        key={`${column.id}-date-filter`}
      >
        <div
          className="w-24 border shadow rounded"
          style={{
            width: "50%",
            border: "1px solid",
            borderRadius: "5px",
          }}
        >
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              column.setFilterValue((old: [Date, Date]) => [date, old?.[1]]);
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start..."
          />
        </div>
        <div
          className="w-24 border shadow rounded"
          style={{
            width: "50%",
            border: "1px solid",
            borderRadius: "5px",
          }}
        >
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              column.setFilterValue((old: [Date, Date]) => [old?.[0], date]);
            }}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End..."
          />
        </div>
      </div>
      <div className="h-1" />
    </>
  );
}

export function BooleanFilter(headerProps: DatabaseHeaderProps) {
  const { column } = headerProps;
  const [value, setValue] = useState<number | string>("All");

  const handlerOnChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newValue =
      event.target.value !== "All" ? Number(event.target.value) : null;
    column.setFilterValue(newValue);
    setValue(newValue);
  };
  return (
    <>
      <select
        typeof="select"
        value={value}
        onChange={handlerOnChange}
        className="w-36 border shadow rounded"
        style={{
          width: "100%",
          background: StyleVariables.BACKGROUND_MODIFIER_FORM_FIELD,
        }}
        key={`${column.id}-select-filter`}
      >
        <option value={"All"}>All</option>
        <option value={1}>True</option>
        <option value={0}>False</option>
      </select>
      <div className="h-1" />
    </>
  );
}
