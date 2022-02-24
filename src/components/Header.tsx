import React, { useState, useEffect } from 'react';
import { usePopper } from 'react-popper';
import ArrowUpIcon from 'components/img/ArrowUp';
import ArrowDownIcon from 'components/img/ArrowDown';
import ArrowLeftIcon from 'components/img/ArrowLeft';
import ArrowRightIcon from 'components/img/ArrowRight';
import TrashIcon from 'components/img/Trash';
import TextIcon from 'components/img/Text';
import MultiIcon from 'components/img/Multi';
import HashIcon from 'components/img/Hash';
import PlusIcon from 'components/img/Plus';
import { ActionTypes, DataTypes, shortId } from 'utils/Constants';

function getPropertyIcon(dataType:string) {
  switch (dataType) {
    case DataTypes.NUMBER:
      return <HashIcon />;
    case DataTypes.TEXT:
      return <TextIcon />;
    case DataTypes.SELECT:
      return <MultiIcon />;
    default:
      return null;
  }
}

function grey(value: any){
  let reference = {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  };

  return reference[value as keyof typeof reference];
}

type ColumProps={
  id:number,
  created:any,
  label:any, 
  dataType:any, 
  getResizerProps:any, 
  getHeaderProps:any
}
type HeaderProps={
  column:any,
  setSortBy:any,
  dataDispatch:any
}

export default function Header(column: ColumProps, setSortBy:any, dataDispatch:any) {
  const [expanded, setExpanded] = useState(column.created || false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [inputRef, setInputRef] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    strategy: 'absolute',
  });
  const [header, setHeader] = useState(column.label);
  const [typeReferenceElement, setTypeReferenceElement] = useState(null);
  const [typePopperElement, setTypePopperElement] = useState(null);
  const typePopper = usePopper(typeReferenceElement, typePopperElement, {
    placement: 'right',
    strategy: 'fixed',
  });
  const [showType, setShowType] = useState(false);
  const buttons = [
    {
      onClick: (e:any) => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId: column.id,
          label: header,
        });
        setSortBy([{ id: column.id, desc: false }]);
        setExpanded(false);
      },
      icon: <ArrowUpIcon />,
      label: 'Sort ascending',
    },
    {
      onClick: (e:any) => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId: column.id,
          label: header,
        });
        setSortBy([{ id: column.id, desc: true }]);
        setExpanded(false);
      },
      icon: <ArrowDownIcon />,
      label: 'Sort descending',
    },
    {
      onClick: (e:any) => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId: column.id,
          label: header,
        });
        dataDispatch({
          type: ActionTypes.ADD_COLUMN_TO_LEFT,
          columnId: column.id,
          focus: false,
        });
        setExpanded(false);
      },
      icon: <ArrowLeftIcon />,
      label: 'Insert left',
    },
    {
      onClick: (e:any) => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId: column.id,
          label: header,
        });
        dataDispatch({
          type: ActionTypes.ADD_COLUMN_TO_RIGHT,
          columnId: column.id,
          focus: false,
        });
        setExpanded(false);
      },
      icon: <ArrowRightIcon />,
      label: 'Insert right',
    },
    {
      onClick: (e:any) => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId: column.id,
          label: header,
        });
        dataDispatch({ type: ActionTypes.DELETE_COLUMN, columnId: column.id });
        setExpanded(false);
      },
      icon: <TrashIcon />,
      label: 'Delete',
    },
  ];
  const propertyIcon = getPropertyIcon(column.dataType);

  const types = [
    {
      onClick: (e:any) => {
        dataDispatch({
          type: 'update_column_type',
          columnId: column.id,
          dataType: DataTypes.SELECT,
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: <MultiIcon />,
      label: 'Select',
    },
    {
      onClick: (e:any) => {
        dataDispatch({
          type: 'update_column_type',
          columnId: column.id,
          dataType: DataTypes.TEXT,
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: <TextIcon />,
      label: 'Text',
    },
    {
      onClick: (e:any) => {
        dataDispatch({
          type: 'update_column_type',
          columnId: column.id,
          dataType: DataTypes.NUMBER,
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: <HashIcon />,
      label: 'Number',
    },
  ];

  function handleKeyDown(e:any) {
    if (e.key === 'Enter') {
      dataDispatch({
        type: 'update_column_header',
        columnId: column.id,
        label: header,
      });
      setExpanded(false);
    }
  }

  function handleChange(e: any) {
    setHeader(e.target.value);
  }

  function handleBlur(e: any) {
    e.preventDefault();
    dataDispatch({ type: 'update_column_header', columnId: column.id, label: header });
  }

  function getHeader() {
    if (column.id !== 999999) {
      return (
        <>
          <div {...column.getHeaderProps()} className="th noselect d-inline-block">
            <div
              className="th-content"
              onClick={() => setExpanded(true)}
              ref={setReferenceElement}
            >
              <span className="svg-icon svg-gray icon-margin">
                {propertyIcon}
              </span>
              {column.label}
            </div>
            <div {...column.getResizerProps()} className="resizer" />
          </div>
          {expanded && (
            <div className="overlay" onClick={() => setExpanded(false)} />
          )}
          {expanded && (
            <div
              ref={setPopperElement}
              style={{ ...styles.popper, zIndex: 3 }}
              {...attributes.popper}
            >
              <div
                className="bg-white shadow-5 border-radius-md"
                style={{
                  width: 240,
                }}
              >
                <div
                  style={{
                    paddingTop: '0.75rem',
                    paddingLeft: '0.75rem',
                    paddingRight: '0.75rem',
                  }}
                >
                  <div className="is-fullwidth" style={{ marginBottom: 12 }}>
                    <input
                      className="form-input"
                      ref={setInputRef}
                      type="text"
                      value={header}
                      style={{ width: '100%' }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <span className="font-weight-600 font-size-75 color-grey-500 text-transform-uppercase">
                    Property Type
                  </span>
                </div>
                <div className="list-padding">
                  <button
                    className="sort-button"
                    type="button"
                    onMouseEnter={() => setShowType(true)}
                    onMouseLeave={() => setShowType(false)}
                    ref={setTypeReferenceElement}
                  >
                    <span className="svg-icon svg-text icon-margin">
                      {getPropertyIcon}
                    </span>
                    <span className="text-transform-capitalize">
                      {column.dataType}
                    </span>
                  </button>
                  {showType && (
                    <div
                      className="shadow-5 bg-white border-radius-md list-padding"
                      ref={setTypePopperElement}
                      onMouseEnter={() => setShowType(true)}
                      onMouseLeave={() => setShowType(false)}
                      {...typePopper.attributes.popper}
                      style={{
                        ...typePopper.styles.popper,
                        width: 200,
                        backgroundColor: 'white',
                        zIndex: 4,
                      }}
                    >
                      {types.map(type => (
                        <button className="sort-button" onClick={type.onClick}>
                          <span className="svg-icon svg-text icon-margin">
                            {type.icon}
                          </span>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  className="list-padding"
                  key={shortId()}
                  style={{
                    borderTop: `2px solid ${grey(200)}`,
                  }}
                >
                  {buttons.map(button => (
                    <button
                      type="button"
                      className="sort-button"
                      onMouseDown={button.onClick}
                    >
                      <span className="svg-icon svg-text icon-margin">
                        {button.icon}
                      </span>
                      {button.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
    return (
      <div {...column.getHeaderProps()} className="th noselect d-inline-block">
        <div
          className="th-content d-flex justify-content-center"
          onClick={e =>
            dataDispatch({
              type: 'add_column_to_left',
              columnId: 999999,
              focus: true,
            })
          }
        >
          <span className="svg-icon-sm svg-gray">
            <PlusIcon />
          </span>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (column.created) {
      setExpanded(true);
    }
  }, [column.created]);

  useEffect(() => {
    setHeader(column.label);
  }, [column.label]);

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  }, [inputRef]);

  return getHeader();
}