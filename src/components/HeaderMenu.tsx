import { DatabaseHeaderProps } from "cdm/FolderModel";
import {
  ActionTypes,
  DataTypes,
  MetadataLabels,
  StyleVariables,
} from "helpers/Constants";
import { dbTrim, c } from "helpers/StylesHelper";
import ArrowUpIcon from "components/img/ArrowUp";
import ArrowDownIcon from "components/img/ArrowDown";
import ArrowLeftIcon from "components/img/ArrowLeft";
import ArrowRightIcon from "components/img/ArrowRight";
import TrashIcon from "components/img/Trash";
import TextIcon from "components/img/Text";
import MultiIcon from "components/img/Multi";
import HashIcon from "components/img/Hash";
import CalendarTimeIcon from "components/img/CalendarTime";
import CalendarIcon from "components/img/CalendarIcon";
import AdjustmentsIcon from "components/img/AdjustmentsIcon";
import React, { useContext, useEffect, useState } from "react";
import { Column } from "react-table";
import { usePopper } from "react-popper";
import { HeaderContext } from "components/contexts/HeaderContext";
import { getColumnWidthStyle } from "components/styles/ColumnWidthStyle";
import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";

type HeaderMenuProps = {
  headerProps: DatabaseHeaderProps;
  setSortBy: any;
  propertyIcon: any;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  created: boolean;
  referenceElement: any;
  labelState: string;
  setLabelState: (label: string) => void;
  isInline: boolean;
  setIsInline: (isInline: boolean) => void;
};
const HeaderMenu = (headerMenuProps: HeaderMenuProps) => {
  /** state of width columns */
  const { columnWidthState, setColumnWidthState } = useContext(HeaderContext);
  /** Header props */
  const {
    setSortBy,
    propertyIcon,
    expanded,
    setExpanded,
    created,
    referenceElement,
    labelState,
    setLabelState,
    isInline,
    setIsInline,
  } = headerMenuProps;
  const { column, rows, initialState } = headerMenuProps.headerProps;
  const dispatch = (headerMenuProps.headerProps as any).dataDispatch;
  /** Column values */
  const [keyState, setkeyState] = useState(dbTrim(column.key));
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

  // Manage errors
  const [labelStateInvalid, setLabelStateInvalid] = useState(false);

  /** Event driven actions */
  useEffect(() => {
    // Throw event if created changed to expand or collapse the menu
    if (created) {
      setExpanded(true);
    }
  }, [created]);

  useEffect(() => {
    // Throw event if label is changed
    setLabelState(labelState);
  }, [labelState]);

  useEffect(() => {
    // Throw event if inputRef changed to focus on when it exists
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
        setSortBy([{ id: column.id, desc: false }]);
        setExpanded(false);
      },
      icon: <ArrowUpIcon />,
      label: "Sort ascending",
    },
    {
      onClick: (e: any) => {
        setSortBy([{ id: column.id, desc: true }]);
        setExpanded(false);
      },
      icon: <ArrowDownIcon />,
      label: "Sort descending",
    },
    {
      onClick: (e: any) => {
        dispatch({
          type: ActionTypes.ADD_COLUMN_TO_LEFT,
          columnId: column.id,
          focus: false,
          columnInfo: adjustWidthOfTheColumnsWhenAdd(column.position - 1),
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
          columnId: column.id,
          focus: false,
          columnInfo: adjustWidthOfTheColumnsWhenAdd(column.position + 1),
        });
        setExpanded(false);
      },
      icon: <ArrowRightIcon />,
      label: "Insert right",
    },
  ];
  /**
   * Add extra buttons if column is not a metadata
   */
  if (!column.isMetadata) {
    buttons.push({
      onClick: (e: any) => {
        dispatch({
          type: ActionTypes.DELETE_COLUMN,
          columnId: column.id,
          key: keyState,
        });
        setExpanded(false);
        delete columnWidthState.widthRecord[column.id];
        setColumnWidthState(columnWidthState);
      },
      icon: <TrashIcon />,
      label: "Delete",
    });
  }
  /**
   * Array of type headers available to change the data type of the column
   */
  const types = [
    {
      onClick: (e: any) => {
        dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: column.id,
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
          columnId: column.id,
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
          columnId: column.id,
          dataType: DataTypes.NUMBER,
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: <HashIcon />,
      label: DataTypes.NUMBER,
    },
    {
      onClick: (e: any) => {
        dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: column.id,
          dataType: DataTypes.CALENDAR,
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: <CalendarIcon />,
      label: DataTypes.CALENDAR,
    },
    {
      onClick: (e: any) => {
        dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: column.id,
          dataType: DataTypes.CALENDAR_TIME,
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: <CalendarTimeIcon />,
      label: MetadataLabels.CALENDAR_TIME,
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

  function persistLabelChange(newKey: string) {
    const futureOrder = headerMenuProps.headerProps.allColumns.map(
      (o: Column) => (o.id === column.id ? newKey : o.id)
    );
    dispatch({
      type: ActionTypes.UPDATE_COLUMN_LABEL,
      columnId: column.id,
      accessor: newKey,
      newKey: newKey,
      label: labelState,
    });
    setExpanded(false);
    setkeyState(newKey);
    columnWidthState.widthRecord[newKey] = getColumnWidthStyle(rows, column);

    /*
      To adjust column settings to the new key, we need to update the order 
      of the columns with it and calculate the new width
     */
    delete columnWidthState.widthRecord[column.id];
    setColumnWidthState(columnWidthState);
    headerMenuProps.headerProps.setColumnOrder(futureOrder);
  }
  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      // trim label will get a valid yaml key
      const newKey = dbTrim(labelState);
      // Check if key already exists. If so, mark it as invalid
      if (
        headerMenuProps.headerProps.allColumns.find(
          (o: Column) => o.id === newKey
        )
      ) {
        setLabelStateInvalid(true);
        return;
      }
      persistLabelChange(newKey);
    }
  }

  function handleChange(e: any) {
    setLabelState(e.target.value);
    if (labelStateInvalid) {
      setLabelStateInvalid(false);
    }
  }

  /**
   * When user leaves the input field
   * @param e
   */
  function handleBlur(e: any) {
    e.preventDefault();
  }

  function adjustWidthOfTheColumnsWhenAdd(wantedPosition: number) {
    const columnNumber =
      initialState.columns.length - initialState.shadowColumns.length;
    const columnName = `newColumn${columnNumber}`;
    const columnLabel = `New Column ${columnNumber}`;
    columnWidthState.widthRecord[columnName] = getColumnWidthStyle(
      rows,
      column
    );
    setColumnWidthState(columnWidthState);
    return { name: columnName, position: wantedPosition, label: columnLabel };
  }

  function handleChangeToggleInlineFrontmatter(e: any) {
    setIsInline(e.target.checked);
    dispatch({
      type: ActionTypes.TOGGLE_INLINE_FRONTMATTER,
      columnId: column.id,
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
            className={`menu ${c("popper")}`}
            style={{
              width: 240,
            }}
          >
            {/** Edit header label section */}
            {!column.isMetadata && (
              <>
                <div
                  style={{
                    paddingTop: "0.75rem",
                    paddingLeft: "0.75rem",
                    paddingRight: "0.75rem",
                  }}
                >
                  <div className="is-fullwidth" style={{ marginBottom: 12 }}>
                    <input
                      className={
                        labelStateInvalid
                          ? `${c("invalid-form")}`
                          : `${c("form-input")}`
                      }
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
                  <div
                    className="menu-item sort-button"
                    onMouseEnter={() => setShowType(true)}
                    onMouseLeave={() => setShowType(false)}
                    ref={setTypeReferenceElement}
                  >
                    <span className="svg-icon svg-text icon-margin">
                      {propertyIcon}
                    </span>
                    <span style={{ textTransform: "capitalize" }}>
                      {column.dataType}
                    </span>
                  </div>
                  {showType && (
                    <div
                      className={`menu ${c("popper")}`}
                      ref={setTypePopperElement}
                      onMouseEnter={() => setShowType(true)}
                      onMouseLeave={() => setShowType(false)}
                      {...typePopper.attributes.popper}
                      style={{
                        ...typePopper.styles.popper,
                        width: 200,
                        zIndex: 4,
                        padding: "4px 0px",
                      }}
                    >
                      {types.map((type) => (
                        <div key={type.label}>
                          <div
                            className="menu-item sort-button"
                            onClick={type.onClick}
                          >
                            <span className="svg-icon svg-text icon-margin">
                              {type.icon}
                            </span>
                            {type.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            {/** Action buttons section */}
            <div
              style={{
                borderTop: `1px solid ${StyleVariables.BACKGROUND_DIVIDER}`,
                padding: "4px 0px",
              }}
            >
              {buttons.map((button) => (
                <div
                  key={button.label}
                  className="menu-item sort-button"
                  onMouseDown={button.onClick}
                >
                  <span className="svg-icon svg-text icon-margin">
                    {button.icon}
                  </span>
                  {button.label}
                </div>
              ))}
            </div>
            {!column.isMetadata && (
              <div
                style={{
                  borderTop: `1px solid ${StyleVariables.BACKGROUND_DIVIDER}`,
                  padding: "4px 0px",
                }}
              >
                {/** Column settings section */}

                <div style={{ padding: "4px 0px" }}>
                  <div
                    className="menu-item sort-button"
                    onMouseEnter={() => setShowSettings(true)}
                    onMouseLeave={() => setShowSettings(false)}
                    ref={setSettingsReferenceElement}
                  >
                    <span className="svg-icon svg-text icon-margin">
                      <AdjustmentsIcon />
                    </span>
                    <span>Settings</span>
                  </div>
                  {showSettings && (
                    <div
                      className={`menu ${c("popper")}`}
                      ref={setSettingsPopperElement}
                      onMouseEnter={() => setShowSettings(true)}
                      onMouseLeave={() => setShowSettings(false)}
                      {...settingsPopper.attributes.popper}
                      style={{
                        ...settingsPopper.styles.popper,
                        width: 200,
                        zIndex: 4,
                        padding: "4px 0px",
                      }}
                    >
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={isInline}
                              onChange={handleChangeToggleInlineFrontmatter}
                            />
                          }
                          label="Inline"
                        />
                      </FormGroup>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
