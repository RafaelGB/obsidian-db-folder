import { ActionTypes, DataTypes, MetadataColumns, UpdateRowOptions } from "helpers/Constants";
import React, { useLayoutEffect, useRef, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"
import { LOGGER } from "services/Logger";
import { Cell } from 'react-table';
import { MarkdownRenderer } from "obsidian";
import PlusIcon from "components/img/Plus";
import { grey, randomColor } from "helpers/Colors";
import { updateRowFile } from "helpers/VaultManagement";
import { usePopper } from "react-popper";
import Relationship from "components/RelationShip";
import ReactDOM from "react-dom";

/**
 * Obtain the path of the file inside cellValue
 * i.e. if cellValue is "[[path/to/file.md|File Name]]" then return "path/to/file.md"
 * i.e. if cellValue is "[[path/to/file.md]]" then return "path/to/file.md"
 * i.e. if cellValue is "[[file.md]]" then return "file.md"
 * @param cellValue 
 */
 function getFilePath(cellValue:string):string {
  const regex = /\[\[(.*)\]\]/;
  const matches = regex.exec(cellValue);
  if (matches && matches.length > 1) {
      return matches[1];
  }
  return "";
}

export default function Cell(cellProperties:Cell) {
    const dataDispatch = (cellProperties as any).dataDispatch;
    /** Initial state of cell */
    const initialValue = cellProperties.value;
    /** Columns information */
    const columns = (cellProperties as any).columns;
    /** Type of cell */
    const dataType = (cellProperties.column as any).dataType;
    /** Column options */
    const options = (cellProperties.column as any).options;
    /** state of cell value */
    const [value, setValue] = useState({ value: initialValue, update: false });
    /** state for keeping the timeout to trigger the editior */
    const [editNoteTimeout, setEditNoteTimeout] = useState(null);
    /** states for selector option  */
    // Selector reference state
    const [selectRef, setSelectRef] = useState(null);
    // Selector popper state
    const [selectPop, setSelectPop] = useState(null);
    const [domReady, setDomReady] = useState(false);
    const [showSelect, setShowSelect] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [addSelectRef, setAddSelectRef] = useState(null);
    const { styles, attributes } = usePopper(selectRef, selectPop);

    React.useEffect(() => {
      setDomReady(true)
    })
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
      LOGGER.debug(`<=Cell.handleOnChange`);
  };

    function getColor() {
      let match = options.find((option: { label: any; }) => option.label === value.value);
      return (match && match.backgroundColor) || grey(200);
    }

    function onChange(event:ContentEditableEvent) {
      // save on disk
      updateRowFile(
        (cellProperties.row.original as any).note.getFile(),
        (cellProperties.column as any).key,
        event.target.value,
        UpdateRowOptions.COLUMN_VALUE
      );
    }

    function handleAddOption(e:any) {
      setShowAdd(true);
    }

    function handleOptionClick(option: { label: string; backgroundColor?: any; }) {
      setValue({ value: option.label, update: true });
      setShowSelect(false);
      // save on disk
      updateRowFile(
        (cellProperties.row.original as any).note.getFile(),
        (cellProperties.column as any).key,
        option.label,
        UpdateRowOptions.COLUMN_VALUE
      );
    }

    function handleOptionBlur(e:any) {
      if (e.target.value !== '') {
        dataDispatch({
          option: e.target.value,
          backgroundColor: randomColor(),
          columnId: (cellProperties.column as any).id
        }, {type: ActionTypes.ADD_OPTION_TO_COLUMN});
      }
      setShowAdd(false);
    }

    /**
     * 
     * @param e Handler for click event on cell
     */
    function handleOptionKeyDown(e:any) {
      if (e.key === 'Enter') {
        if (e.target.value !== '') {
          dataDispatch({
            columns: columns,
            option: e.target.value,
            backgroundColor: randomColor(),
            columnId: (cellProperties.column as any).id,
            type: ActionTypes.ADD_OPTION_TO_COLUMN
          });
        }
        setShowAdd(false);
      }
    }
    /**
     * Popper for selector
     * @returns 
     */
    function renderPopperSelect() {
      return (
        <div>
          {/* hide selector if click outside of it */}
          {showSelect && <div className='overlay' onClick={() => setShowSelect(false)} />}
          {/* show selector if click on the current value */}
          {showSelect && (
            <div
              className='shadow-5 bg-white border-radius-md'
              ref={setSelectPop}
              {...attributes.popper}
              style={{
                ...styles.popper,
                zIndex: 4,
                minWidth: 200,
                maxWidth: 320,
                padding: "0.75rem"
              }}>
              <div className='d-flex flex-wrap-wrap' style={{marginTop: "-0.5rem"}}>
                {options.map((option:any) => (
                  <div
                    key={option.label}
                    className='cursor-pointer'
                    style={{marginRight: "0.5rem", marginTop: "0.5rem"}}
                    onClick={() => handleOptionClick(option)}>
                    <Relationship value={option.label} backgroundColor={option.backgroundColor} />
                  </div>
                ))}
                {showAdd && (
                  <div
                    style={{
                      marginRight: "0.5rem",
                      marginTop: "0.5rem",
                      width: 120,
                      padding: "2px 4px",
                      backgroundColor: grey(200),
                      borderRadius: 4
                    }}>
                    <input
                      type='text'
                      className='option-input'
                      onBlur={handleOptionBlur}
                      ref={setAddSelectRef}
                      onKeyDown={handleOptionKeyDown}
                    />
                  </div>
                )}
                <div
                  className='cursor-pointer'
                  style={{marginRight: "0.5rem", marginTop: "0.5rem"}}
                  onClick={handleAddOption}>
                  <Relationship
                    value={
                      <span className='svg-icon-sm svg-text'>
                        <PlusIcon />
                      </span>
                    }
                    backgroundColor={grey(200)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    function getCellElement() {
      switch (dataType) {
        /** Plain text option */
        case DataTypes.TEXT:
        return (
          <ContentEditable
            html={(value.value && value.value.toString()) || ''}
            onChange={handleOnChange}
            onBlur={() => setValue(old => ({ value: old.value, update: true }))}
            className="data-input"
          />
        );
        /** Number option */
        case DataTypes.NUMBER:
        return (
          <ContentEditable
            html={(value.value && value.value.toString()) || ''}
            onChange={handleOnChange}
            onBlur={() => setValue(old => ({ value: old.value, update: true }))}
            className="data-input text-align-right"
          />
        );
        /** Markdown option */
        case DataTypes.MARKDOWN:
          const containerRef = useRef<HTMLElement>();
          useLayoutEffect(() => {
            //TODO - this is a hack. find why is layout effect called twice
            containerRef.current.innerHTML = '';
            MarkdownRenderer.renderMarkdown(
              value.value,
              containerRef.current,
              getFilePath(value.value),
              null
            );
          });
          return (
          <span ref={containerRef}></span>
          );
        /** Selector option */
        case DataTypes.SELECT:
          return(
          <>
            {/* Current value of the select */}
            <div
              ref={setSelectRef}
              className='cell-padding d-flex cursor-default align-items-center flex-1'
              onClick={() => setShowSelect(true)}>
              {value.value && <Relationship value={value.value} backgroundColor={getColor()} />}
            </div>
            {domReady ? ReactDOM.createPortal(renderPopperSelect(),document.getElementById('popper-container')) : null}
          </>
          );
        /** Default option */
        default:
          return <span></span>;
      }
    }
    return getCellElement();
}
