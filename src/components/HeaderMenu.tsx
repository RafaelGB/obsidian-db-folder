import { TableColumn, TableDataType } from "cdm/FolderModel";
import {
  ActionTypes,
  DataTypes,
  StyleVariables,
  WidthVariables,
} from "helpers/Constants";
import { dbTrim, recalculateColumnWidth } from "helpers/StylesHelper";
import ArrowUpIcon from "components/img/ArrowUp";
import ArrowDownIcon from "components/img/ArrowDown";
import ArrowLeftIcon from "components/img/ArrowLeft";
import ArrowRightIcon from "components/img/ArrowRight";
import TrashIcon from "components/img/Trash";
import TextIcon from "components/img/Text";
import MultiIcon from "components/img/Multi";
import HashIcon from "components/img/Hash";
import AdjustmentsIcon from "components/img/AdjustmentsIcon";
import React, { useContext, useEffect, useState } from "react";
import { ActionType } from "react-table";
import { usePopper } from "react-popper";
import { HeaderContext } from "components/contexts/HeaderContext";
import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";
type HeaderMenuProps = {
  dispatch: (action: ActionType) => void;
  setSortBy: any;
  column: TableColumn;
  columns: TableColumn[];
  propertyIcon: any;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  created: boolean;
  referenceElement: any;
  labelState: string;
  setLabelState: (label: string) => void;
  initialState: TableDataType;
  isInline: boolean;
  setIsInline: (isInline: boolean) => void;
};
const HeaderMenu = (headerMenuProps: HeaderMenuProps) => {
  const {
    dispatch,
    setSortBy,
    propertyIcon,
    expanded,
    setExpanded,
    created,
    referenceElement,
    labelState,
    setLabelState,
    initialState,
    isInline,
    setIsInline,
  } = headerMenuProps;
  /** state of width columns */
  const { columnWidthState, setColumnWidthState } = useContext(HeaderContext);
  /** Column values */
  const { id, key, dataType, position } = headerMenuProps.column;
  const [keyState, setkeyState] = useState(dbTrim(key));
  const [popperElement, setPopperElement] = useState(null);
  const [inputRef, setInputRef] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
    strategy: "absolute",
  });
  // Manage type of data
  const [typeReferenceElement, setTypeReferenceElement] = useState(null);
  const [typePopperElement, setTypePopperElement] = useState(null);
  const [showType, setShowType] = useState(false);

  // Manage settings
  const [settingsReferenceElement, setSettingsReferenceElement] =
    useState(null);
  const [settingsPopperElement, setSettingsPopperElement] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

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

  /**
   * Array of action buttons asociated to the header
   */
  const buttons = [
    {
      onClick: (e: any) => {
        setSortBy([{ id: id, desc: false }]);
        setExpanded(false);
      },
      icon: <ArrowUpIcon />,
      label: "Sort ascending",
    },
    {
      onClick: (e: any) => {
        setSortBy([{ id: id, desc: true }]);
        setExpanded(false);
      },
      icon: <ArrowDownIcon />,
      label: "Sort descending",
    },
    {
      onClick: (e: any) => {
        dispatch({
          type: ActionTypes.ADD_COLUMN_TO_LEFT,
          columnId: id,
          focus: false,
          columnInfo: adjustWidthOfTheColumn(position - 1),
        });
        setExpanded(false);
      },
      icon: <ArrowLeftIcon />,
      label: "Insert left",
    },
    {
      onClick: (e: any) => {
        dispatch({
          type: ActionTypes.ADD_COLUMN_TO_RIGHT,
          columnId: id,
          focus: false,
          columnInfo: adjustWidthOfTheColumn(position + 1),
        });
        setExpanded(false);
      },
      icon: <ArrowRightIcon />,
      label: "Insert right",
    },
    {
      onClick: (e: any) => {
        dispatch({
          type: ActionTypes.DELETE_COLUMN,
          columnId: id,
          key: keyState,
        });
        setExpanded(false);
        delete columnWidthState.widthRecord[id];
        setColumnWidthState(columnWidthState);
      },
      icon: <TrashIcon />,
      label: "Delete",
    },
  ];

  /**
   * Array of type headers available to change the data type of the column
   */
  const types = [
    {
      onClick: (e: any) => {
        dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: id,
          dataType: DataTypes.SELECT,
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: <MultiIcon />,
      label: DataTypes.SELECT,
    },
    {
      onClick: (e: any) => {
        dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: id,
          dataType: DataTypes.TEXT,
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: <TextIcon />,
      label: DataTypes.TEXT,
    },
    {
      onClick: (e: any) => {
        dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: id,
          dataType: DataTypes.NUMBER,
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: <HashIcon />,
      label: DataTypes.NUMBER,
    },
  ];

  const typePopper = usePopper(typeReferenceElement, typePopperElement, {
    placement: "right",
    strategy: "fixed",
  });

  const settingsPopper = usePopper(
    settingsReferenceElement,
    settingsPopperElement,
    {
      placement: "auto",
      strategy: "fixed",
    }
  );

  function persistLabelChange() {
    dispatch({
      type: ActionTypes.UPDATE_COLUMN_LABEL,
      columnId: id,
      accessor: keyState,
      label: labelState,
      columnInfo: adjustWidthOfTheColumn(position),
    });
    setExpanded(false);
    setkeyState(dbTrim(labelState));
  }

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      persistLabelChange();
    }
  }

  function handleChange(e: any) {
    setLabelState(e.target.value);
  }

  /**
   * When user leaves the input field
   * @param e
   */
  function handleBlur(e: any) {
    e.preventDefault();
  }

  function adjustWidthOfTheColumn(wantedPosition: number) {
    const columnNumber =
      initialState.columns.length - initialState.shadowColumns.length;
    const columnName = `newColumn${columnNumber}`;
    const columnLabel = `New Column ${columnNumber}`;
    setColumnWidthState(
      recalculateColumnWidth(columnWidthState, columnName, columnLabel)
    );
    return { name: columnName, position: wantedPosition, label: columnLabel };
  }

  function handleChangeToggleInlineFrontmatter(e: any) {
    setIsInline(e.target.checked);
    dispatch({
      type: ActionTypes.TOGGLE_INLINE_FRONTMATTER,
      columnId: id,
      isInline: e.target.checked,
    });
  }

  return (
    <div>
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
            className="shadow-5 border-radius-md"
            style={{
              width: 240,
              backgroundColor: StyleVariables.BACKGROUND_SECONDARY,
            }}
          >
            {/** Edit header label section */}
            <div
              style={{
                paddingTop: "0.75rem",
                paddingLeft: "0.75rem",
                paddingRight: "0.75rem",
              }}
            >
              <div className="is-fullwidth" style={{ marginBottom: 12 }}>
                <input
                  className="form-input"
                  ref={setInputRef}
                  type="text"
                  value={labelState}
                  style={{ width: "100%" }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <span
                className="font-weight-600 font-size-75"
                style={{
                  textTransform: "uppercase",
                  color: StyleVariables.TEXT_FAINT,
                }}
              >
                Property Type
              </span>
            </div>
            {/** Type of column section */}
            <div style={{ padding: "4px 0px" }}>
              <button
                className="sort-button"
                type="button"
                onMouseEnter={() => setShowType(true)}
                onMouseLeave={() => setShowType(false)}
                ref={setTypeReferenceElement}
              >
                <span className="svg-icon svg-text icon-margin">
                  {propertyIcon}
                </span>
                <span style={{ textTransform: "capitalize" }}>{dataType}</span>
              </button>
              {showType && (
                <div
                  className="shadow-5 border-radius-m"
                  ref={setTypePopperElement}
                  onMouseEnter={() => setShowType(true)}
                  onMouseLeave={() => setShowType(false)}
                  {...typePopper.attributes.popper}
                  style={{
                    ...typePopper.styles.popper,
                    width: 200,
                    backgroundColor: StyleVariables.BACKGROUND_SECONDARY,
                    zIndex: 4,
                    padding: "4px 0px",
                  }}
                >
                  {types.map((type) => (
                    <div key={type.label}>
                      <button className="sort-button" onClick={type.onClick}>
                        <span className="svg-icon svg-text icon-margin">
                          {type.icon}
                        </span>
                        {type.label}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/** Action buttons section */}
            <div
              style={{
                borderTop: `2px solid ${StyleVariables.BACKGROUND_DIVIDER}`,
                padding: "4px 0px",
              }}
            >
              {buttons.map((button) => (
                <button
                  key={button.label}
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
            <div
              style={{
                borderTop: `2px solid ${StyleVariables.BACKGROUND_DIVIDER}`,
                padding: "4px 0px",
              }}
            >
              {/** Column settings section */}
              <div style={{ padding: "4px 0px" }}>
                <button
                  className="sort-button"
                  type="button"
                  onMouseEnter={() => setShowSettings(true)}
                  onMouseLeave={() => setShowSettings(false)}
                  ref={setSettingsReferenceElement}
                >
                  <span className="svg-icon svg-text icon-margin">
                    <AdjustmentsIcon />
                  </span>
                  <span>Settings</span>
                </button>
                {showSettings && (
                  <div
                    className="shadow-5 border-radius-m"
                    ref={setSettingsPopperElement}
                    onMouseEnter={() => setShowSettings(true)}
                    onMouseLeave={() => setShowSettings(false)}
                    {...settingsPopper.attributes.popper}
                    style={{
                      ...settingsPopper.styles.popper,
                      width: 200,
                      backgroundColor: StyleVariables.BACKGROUND_SECONDARY,
                      zIndex: 4,
                      padding: "4px 0px",
                    }}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isInline}
                            onChange={(event) => {
                              handleChangeToggleInlineFrontmatter(event);
                            }}
                          />
                        }
                        label="Inline"
                      />
                    </FormGroup>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
