import React from "react";
import Field from "components/Field";

interface RFieldGroup {
  field: any, 
  fieldChanged: any,
  values: any
}

const FieldGroup = (rfieldGroup: RFieldGroup) => {
  const fields = rfieldGroup.field.fields;

  return (
    <fieldset key={rfieldGroup.field._uid}>
      <h3>{rfieldGroup.field.label}</h3>
      
    </fieldset>
  );
};

export default FieldGroup;
