import { DataTypes } from "helpers/Constants";
import React, { useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"
import { LOGGER } from "services/Logger";

export default function Cell(cellProperties:any) {
    /** Initial state of cell */
    const initialValue = cellProperties.value;
    /** Type of cell */
    const dataType = cellProperties.column.dataType;
    const [value, setValue] = useState({ value: initialValue, update: false });

    function onChange(event:ContentEditableEvent) {
      setValue({ value: event.target.value, update: false });
    }
    function getCellElement() {
      switch (dataType) {
        case DataTypes.TEXT:
        return (
          <ContentEditable
            html={(value.value && value.value.toString()) || ''}
            onChange={onChange}
            onBlur={() => setValue(old => ({ value: old.value, update: true }))}
            className="data-input"
          />
        );
        default:
          LOGGER.warn(`Cell: unknown data type '${dataType}'`,`Properties asociated: ${Object.keys(cellProperties)}`);
          return <span></span>;
      }
    }
    return getCellElement();
}