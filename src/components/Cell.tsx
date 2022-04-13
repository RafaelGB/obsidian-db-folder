import { CellDataType } from "cdm/FolderModel";
import { DataTypes } from "helpers/Constants";
import React, { useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"
import { FileManagerDB } from "services/FileManagerService";
import { LOGGER } from "services/Logger";
import { Cell } from 'react-table';

export default function Cell(cellProperties:Cell) {
    /** Initial state of cell */
    const initialValue = cellProperties.value;
    /** Type of cell */
    const dataType = (cellProperties.column as any).dataType;
    // state of cell value
    const [value, setValue] = useState({ value: initialValue, update: false });
    // state for keeping the timeout
    const [editNoteTimeout, setEditNoteTimeout] = useState(null);

    // onChange handler
  const handleOnChange = (event:ContentEditableEvent) => {
    // cancelling previous timeouts
      if (editNoteTimeout) {
        clearTimeout(editNoteTimeout);
      }
      // first update the input text as user type
      setValue({ value: event.target.value, update: false });
      // initialize a setimeout by wrapping in our editNoteTimeout so that we can clear it out using clearTimeout
      setEditNoteTimeout(
        setTimeout(() => {
          onChange(event);
          // timeout until event is triggered after user has stopped typing
        }, 1500),
      );
  };

    function onChange(event:ContentEditableEvent) {
      const cellBasenameFile:string = (cellProperties.row.original as any).title.replace(/\[\[|\]\]/g, '').split('|')[0];
      LOGGER.debug(`<=>Cell: onChange: ${cellBasenameFile}`);
      const columnHeader = cellProperties.column.Header;
      
      let noteObject = {
        action: 'replace',
        filePath: `${cellBasenameFile}`,
        regexp: new RegExp(`^[\s]*${columnHeader}[:]{1}(.+)$`,"gm"),
        newValue: `${columnHeader}: ${value.value}`
      };
      
      FileManagerDB.editNoteContent(noteObject);
    }

    function getCellElement() {
      switch (dataType) {
        case DataTypes.TEXT:
        return (
          <ContentEditable
            html={(value.value && value.value.toString()) || ''}
            onChange={handleOnChange}
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