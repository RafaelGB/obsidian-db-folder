import React, { useState, useEffect } from 'react';
import { usePopper } from 'react-popper';
import { grey, randomColor } from 'helpers/Colors';
import ArrowUpIcon from 'components/img/ArrowUp';
import ArrowDownIcon from 'components/img/ArrowDown';
import ArrowLeftIcon from 'components/img/ArrowLeft';
import ArrowRightIcon from 'components/img/ArrowRight';
import TrashIcon from 'components/img/Trash';
import TextIcon from 'components/img/Text';
import MultiIcon from 'components/img/Multi';
import HashIcon from 'components/img/Hash';
import PlusIcon from 'components/img/Plus';
import { ActionTypes, DataTypes } from 'helpers/Constants';
import { LOGGER } from 'services/Logger';
import { DatabaseHeaderProps } from 'cdm/FolderModel';

function setOptionsOfSelectDataType(options:any[],rows:any,columnId:string):any[]{
  rows.forEach((row:any)=>{
    const rowValue = row.values[columnId];
    let match = options.find((option: { label: any; }) => option.label === rowValue);
    if(!match){
      options.push({label: rowValue, backgroundColor: randomColor()});
    }
  });
  return options;
}

/**
 * Default headers of the table
 * @param headerProps 
 * @returns 
 */
export default function Header(headerProps:DatabaseHeaderProps) {
  LOGGER.debug(`=>Header ${headerProps.column.label}`);
  // TODO : add a tooltip to the header
  const created:boolean = false;
  /** Properties of header */
  const {setSortBy, rows} = headerProps;
  /** Column values */
  const { id, dataType, options, getResizerProps} = headerProps.column;
  /** reducer asociated to database */
  // TODO typying improve
  const dataDispatch = (headerProps as any).dataDispatch;
  const [expanded, setExpanded] = useState(created || false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [isMetadata, setIsMetadata] = useState(headerProps.column.isMetadata);
  const [popperElement, setPopperElement] = useState(null);
  const [inputRef, setInputRef] = useState(null);
  const {styles, attributes} = usePopper(referenceElement, popperElement, {
    placement: "bottom",
    strategy: "absolute"
  });
  const [labelState, setLabelState] = useState(headerProps.column.label);
  const [accessorState, setAccessorState] = useState(headerProps.column.label.trim());
  const [typeReferenceElement, setTypeReferenceElement] = useState(null);
  const [typePopperElement, setTypePopperElement] = useState(null);
  const [showType, setShowType] = useState(false);
  const buttons = [
    {
      onClick: (e:any) => {
        //dataDispatch({type: ActionTypes.UPDATE_COLUMN_LABEL, columnId: id, label: header});
        setSortBy([{id: id, desc: false}]);
        setExpanded(false);
      },
      icon: <ArrowUpIcon />,
      label: "Sort ascending"
    },
    {
      onClick: (e:any) => {
        //dataDispatch({type: ActionTypes.UPDATE_COLUMN_LABEL, columnId: id, label: header});
        setSortBy([{id: id, desc: true}]);
        setExpanded(false);
      },
      icon: <ArrowDownIcon />,
      label: "Sort descending"
    },
    {
      onClick: (e:any) => {
        //dataDispatch({type: ActionTypes.UPDATE_COLUMN_LABEL, columnId: id, label: header});
        dataDispatch({type: ActionTypes.ADD_COLUMN_TO_LEFT, columnId: id, focus: false});
        setExpanded(false);
      },
      icon: <ArrowLeftIcon />,
      label: "Insert left"
    },
    {
      onClick: (e:any) => {
        //dataDispatch({type: ActionTypes.UPDATE_COLUMN_LABEL, columnId: id, label: header});
        dataDispatch({type: ActionTypes.ADD_COLUMN_TO_RIGHT, columnId: id, focus: false});
        setExpanded(false);
      },
      icon: <ArrowRightIcon />,
      label: "Insert right"
    },
    {
      onClick: (e:any) => {
        //dataDispatch({type: ActionTypes.UPDATE_COLUMN_LABEL, columnId: id, label: header});
        dataDispatch({type: ActionTypes.DELETE_COLUMN, columnId: id});
        setExpanded(false);
      },
      icon: <TrashIcon />,
      label: "Delete"
    }
  ];

  const types = [
    {
      onClick: (e:any) => {
        dataDispatch({type: ActionTypes.UPDATE_COLUMN_TYPE, columnId: id, dataType: DataTypes.SELECT});
        setShowType(false);
        setExpanded(false);
      },
      icon: <MultiIcon />,
      label: DataTypes.SELECT
    },
    {
      onClick: (e:any) => {
        dataDispatch({type: ActionTypes.UPDATE_COLUMN_TYPE, columnId: id, dataType: DataTypes.TEXT});
        setShowType(false);
        setExpanded(false);
      },
      icon: <TextIcon />,
      label: DataTypes.TEXT
    },
    {
      onClick: (e:any) => {
        dataDispatch({type: ActionTypes.UPDATE_COLUMN_TYPE, columnId: id, dataType: DataTypes.NUMBER});
        setShowType(false);
        setExpanded(false);
      },
      icon: <HashIcon />,
      label: DataTypes.NUMBER
    }
  ];

  let propertyIcon:any;
  switch (dataType) {
    case DataTypes.NUMBER:
      propertyIcon = <HashIcon />;
      break;
    case DataTypes.TEXT:
      propertyIcon = <TextIcon />;
      break;
    case DataTypes.SELECT:
      setOptionsOfSelectDataType(options,rows,id);
      propertyIcon = <MultiIcon />;
      break;
    case DataTypes.MARKDOWN:
      // TODO : add a markdown icon
      propertyIcon = <TextIcon />;
      break;
    default:
      break;
  }

  useEffect(() => {
    if (created) {
      setExpanded(true);
    }
  }, [created]);

  useEffect(() => {
    setLabelState(labelState);
  }, [labelState]);

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  }, [inputRef]);
  const typePopper = usePopper(typeReferenceElement, typePopperElement, {
    placement: "right",
    strategy: "fixed"
  });

  function handleKeyDown(e:any) {
    if (e.key === "Enter") {
      dataDispatch({
        type: ActionTypes.UPDATE_COLUMN_LABEL,
        columnId: id,
        accessor: accessorState,
        label: labelState
      });
      setExpanded(false);
      setAccessorState(labelState.trim());
    }
  }

  function handleChange(e:any) {
    setLabelState(e.target.value);
  }

  function handlerAddColumnToLeft(e:any) {
    dataDispatch({type: ActionTypes.ADD_COLUMN_TO_LEFT, columnId: 999999, focus: true})
  }

  /**
   * When user leaves the input field
   * @param e 
   */
  function handleBlur(e:any) {
    e.preventDefault();
    //dataDispatch({type: ActionTypes.UPDATE_COLUMN_LABEL, columnId: id, label: header});
  }

  function renderHeaderOptions(){
    return(
      <div>
        {expanded && <div className='overlay' onClick={() => setExpanded(false)} />}
        {expanded && (
        <div ref={setPopperElement} style={{...styles.popper, zIndex: 3}} {...attributes.popper}>
          <div
            className='bg-white shadow-5 border-radius-md'
            style={{
              width: 240
            }}>
            {/** Edit header label section */}
            <div style={{paddingTop: "0.75rem", paddingLeft: "0.75rem", paddingRight: "0.75rem"}}>
              <div className='is-fullwidth' style={{marginBottom: 12}}>
                <input
                  className='form-input'
                  ref={setInputRef}
                  type='text'
                  value={labelState}
                  style={{width: "100%"}}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <span className='font-weight-600 font-size-75' style={{textTransform: "uppercase", color: grey(500)}}>
                Property Type
              </span>
            </div>
            {/** Edit header label section */}
            <div style={{padding: "4px 0px"}}>
              <button
                className='sort-button'
                type='button'
                onMouseEnter={() => setShowType(true)}
                onMouseLeave={() => setShowType(false)}
                ref={setTypeReferenceElement}>
                <span className='svg-icon svg-text icon-margin'>{propertyIcon}</span>
                <span style={{textTransform: "capitalize"}}>{dataType}</span>
              </button>
              {showType && (
                <div
                  className='shadow-5 bg-white border-radius-m'
                  ref={setTypePopperElement}
                  onMouseEnter={() => setShowType(true)}
                  onMouseLeave={() => setShowType(false)}
                  {...typePopper.attributes.popper}
                  style={{
                    ...typePopper.styles.popper,
                    width: 200,
                    backgroundColor: "white",
                    zIndex: 4,
                    padding: "4px 0px"
                  }}>
                  {types.map((type) => (
                    <div key={type.label}>
                      <button className='sort-button' onClick={type.onClick}>
                        <span className='svg-icon svg-text icon-margin'>{type.icon}</span>
                        {type.label}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              style={{
                borderTop: `2px solid ${grey(200)}`,
                padding: "4px 0px"
              }}>
              {buttons.map((button) => (
                <button key={button.label} type='button' className='sort-button' onMouseDown={button.onClick}>
                  <span className='svg-icon svg-text icon-margin'>{button.icon}</span>
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    );
  }
  LOGGER.debug(`<=Header ${headerProps.column.label}`);
  return id !== "999999" ? (
    <>
      <div className='th-content' onClick={() => setExpanded(true)} ref={setReferenceElement}>
        <span className='svg-icon svg-gray icon-margin'>{propertyIcon}</span>
        {labelState}
      </div>
      <div {...getResizerProps()} className='resizer' />
      {!isMetadata && renderHeaderOptions()}
    </>
  ) : (
      <div
        className='th-content'
        style={{display: "flex", justifyContent: "center"}}
        onClick={handlerAddColumnToLeft}>
        <span className='svg-icon-sm svg-gray'>
          <PlusIcon />
        </span>
      </div>
  );
}