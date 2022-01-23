import React, { Fragment } from "react";

interface ROptions {
  field: any, 
  fieldChanged: any,
  value: any
}

const Options = (rOptions: ROptions) => {
  return (
    <div>
      <h3>{rOptions.field.label}</h3>
      {rOptions.field.options.map((option:any, index:any) => {
        return (
          <Fragment key={option.value}>
            <label htmlFor={option.value}>
              <input
                type="radio"
                id={option.value}
                name={rOptions.field._uid}
                value={option.value}
                checked={rOptions.value === option.value}
                onChange={(e) => {
                  rOptions.fieldChanged(rOptions.field._uid, e.target.value);
                }}
              />
              {option.label}
            </label>
            {index < rOptions.field.options.length - 1 && <br />}
          </Fragment>
        );
      })}
    </div>
  );
};

export default Options;
