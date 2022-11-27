import InputBase from "@mui/material/InputBase";
import React, { InputHTMLAttributes, useEffect, useState } from "react";

// A debounced input react component
export function GlobalDebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  placeholder,
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
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
      style={{}}
      autoFocus={true}
    />
  );
}

export function DynamicDebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  placeholder,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
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
      placeholder={placeholder}
    />
  );
}
