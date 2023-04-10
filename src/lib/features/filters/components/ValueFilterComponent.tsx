import Autocomplete from "@mui/material/Autocomplete";
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import { InputType, StyleVariables } from "helpers/Constants";
import React, { ChangeEvent, useState } from "react";
import { valueToCalendarConverter } from "../mappers/FilterValuesMapper";

const ValueFilterComponent = (props: {
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type: string;
}) => {
  const { type, value } = props;
  const [valueState, setValueSate] = useState(value);
  const [valueTimeout, setValueTimeout] = useState(null);
  const proxyHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (valueTimeout) {
      clearTimeout(valueTimeout);
    }
    // first update the input text as user type
    setValueSate(event.target.value);
    // initialize a setimeout by wrapping in our editNoteTimeout so that we can clear it out using clearTimeout
    setValueTimeout(
      setTimeout(() => {
        props.handler(event);
        // timeout until event is triggered after user has stopped typing
      }, 1500)
    );
  };
  switch (type) {
    case InputType.CALENDAR:
    case InputType.CALENDAR_TIME:
      return (
        <AutocompleteFrom
          value={valueState}
          handler={proxyHandler}
          options={Array.from(valueToCalendarConverter.keys()).map(
            (key) => `@${key}`
          )}
        />
      );
    case InputType.NUMBER:
      return (
        <InputForm value={valueState} handler={proxyHandler} type="number" />
      );
    default:
      return <InputForm value={valueState} handler={proxyHandler} />;
  }
};

function InputForm(props: {
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type?: string;
}) {
  const { value, handler, type } = props;
  return (
    <Input
      type={type !== undefined ? type : "text"}
      className="form-control"
      value={value}
      onChange={handler}
    />
  );
}

function AutocompleteFrom(props: {
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  options: string[];
}) {
  const { value, handler, options } = props;
  const [valueState, setValueSate] = useState(value);
  const [inputValue, setInputValue] = useState(value);
  return (
    <Autocomplete
      freeSolo
      disableClearable
      options={options}
      value={valueState}
      onChange={(event: any, newValue: string | null) => {
        setValueSate(newValue);
        handler({
          target: { value: newValue },
        } as ChangeEvent<HTMLInputElement>);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      componentsProps={{
        paper: {
          sx: {
            width: "max-content",
            backgroundColor: StyleVariables.BACKGROUND_PRIMARY,
            color: StyleVariables.TEXT_NORMAL,
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          className="form-control"
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
          variant="standard"
        />
      )}
    />
  );
}

export default ValueFilterComponent;
