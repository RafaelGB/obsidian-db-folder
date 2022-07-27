import InputBase from "@mui/material/InputBase";
import React from "react";

// A debounced input react component
export default function DebouncedInput({
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
      style={{}}
    />
  );
}
