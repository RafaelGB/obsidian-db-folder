import Input from "@mui/material/Input";
import React, { useState } from "react";

const ValueFilterComponent = (props: {
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type: string;
}) => {
  const [value, setValue] = useState(props.value);
  const [valueTimeout, setValueTimeout] = useState(null);
  const proxyHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (valueTimeout) {
      clearTimeout(valueTimeout);
    }
    // first update the input text as user type
    setValue(event.target.value);
    // initialize a setimeout by wrapping in our editNoteTimeout so that we can clear it out using clearTimeout
    setValueTimeout(
      setTimeout(() => {
        props.handler(event);
        // timeout until event is triggered after user has stopped typing
      }, 1500)
    );
  };

  return (
    <Input
      type="text"
      className="form-control"
      value={value}
      onChange={proxyHandler}
    />
  );
};

export default ValueFilterComponent;
