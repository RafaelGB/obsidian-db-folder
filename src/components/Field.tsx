import React from "react";

interface RField {
  field: any, 
  fieldChanged: any, 
  type?: any, 
  value: any
}


const Field = (rfield: RField) => {
  return (
    <div key={rfield.field._uid}>
      <label htmlFor={rfield.field._uid}>{rfield.field.label}</label>
      <input
        type={rfield.type || rfield.field.component}
        id={rfield.field._uid}
        name={rfield.field._uid}
        value={rfield.value}
        onChange={(e) => {
          // Notify the main state list of the new value
          rfield.fieldChanged(rfield.field._uid, e.target.value);
        }}
      />
    </div>
  );
};

export default Field;