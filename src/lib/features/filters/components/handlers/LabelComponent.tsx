import React, { ChangeEventHandler, useState } from "react";

const LabelComponent = (props: {
  onChangeLabelHandler: ChangeEventHandler<HTMLInputElement>;
  label: string;
  index: number;
}) => {
  const { onChangeLabelHandler, label, index } = props;
  const [labelState, setLabelState] = useState(label);
  const proxyOnChangeLabelHandler: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setLabelState(event.target.value);
    onChangeLabelHandler(event);
  };
  return (
    <input
      type="text"
      max={15}
      value={labelState ?? `filter-${index}`}
      onChange={proxyOnChangeLabelHandler}
    />
  );
};
export default LabelComponent;
