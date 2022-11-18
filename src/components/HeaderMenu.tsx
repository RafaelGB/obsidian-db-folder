import { InputType, StyleVariables } from "helpers/Constants";
import { dbTrim, c, getLabelHeader } from "helpers/StylesHelper";
import AdjustmentsIcon from "components/img/AdjustmentsIcon";
import React, { FocusEventHandler, useEffect, useState } from "react";
import { usePopper } from "react-popper";
import Popper from "@mui/material/Popper";
import header_action_button_section from "components/headerActions/HeaderActionButtonSection";
import header_action_types_section from "components/headerActions/HeaderActiontypesSection";
import { ColumnSettingsModal } from "components/modals/columnSettings/ColumnSettingsModal";
import { TableColumn } from "cdm/FolderModel";
import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { HeaderMenuProps } from "cdm/HeaderModel";
import Box from "@mui/material/Box";

const HeaderMenu = (headerMenuProps: HeaderMenuProps) => {
  const { table, column } = headerMenuProps.headerProps;

  const [columnsInfo, columnActions] = table.options.meta.tableState.columns(
    (state) => [state.info, state.actions]
  );
  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );
  const configInfo = table.options.meta.tableState.configState(
    (state) => state.info
  );

  /** Header props */
  const { propertyIcon, menuEl, setMenuEl, labelState, setLabelState } =
    headerMenuProps;

  const { key, isMetadata, input } = column.columnDef as TableColumn;
  /** Column values */
  const [keyState, setkeyState] = useState(dbTrim(key));
  const [inputRef, setInputRef] = useState(null);
  // Manage type of data
  const [typeReferenceElement, setTypeReferenceElement] = useState(null);
  const [typePopperElement, setTypePopperElement] = useState(null);
  const [showType, setShowType] = useState(false);

  // Manage Popper
  const open = Boolean(menuEl);
  const id = open ? `header-menu-${column.id}` : undefined;
  // Manage errors
  const [labelStateInvalid, setLabelStateInvalid] = useState(false);

  /** Event driven actions */
  // useEffect(() => {
  //   // Throw event if created changed to expand or collapse the menu
  //   if (created) {
  //     setExpanded(true);
  //   }
  // }, [created]);

  /**
   * Array of action buttons asociated to the header
   */
  let headerActionResponse: HeaderActionResponse = {
    buttons: [],
    headerMenuProps: headerMenuProps,
    hooks: {
      setMenuEl: setMenuEl,
      keyState: keyState,
      setKeyState: setkeyState,
      setShowType: setShowType,
    },
  };
  const headerButtons =
    header_action_button_section.run(headerActionResponse).buttons;

  // /**
  //  * Array of type headers available to change the data type of the column
  //  */
  headerActionResponse.buttons = [];
  const typesButtons =
    header_action_types_section.run(headerActionResponse).buttons;

  const typePopper = usePopper(typeReferenceElement, typePopperElement, {
    placement: "right",
    strategy: "fixed",
  });

  function persistLabelChange() {
    // Update state of altered column
    columnActions.alterColumnLabel(column.columnDef as TableColumn, labelState);
  }

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      inputRef.blur();
    }
  }

  function handleChange(e: any) {
    setLabelState(e.target.value);
    if (labelStateInvalid) {
      setLabelStateInvalid(false);
    }
  }

  function handleOnMouseLeaveLabel() {
    if (document.activeElement === inputRef) {
      inputRef.blur();
    }
  }
  /**
   * When user leaves the input field
   * @param e
   */
  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    persistLabelChange();
  };

  return (
    <Popper id={id} open={open} anchorEl={menuEl}>
      <Box>
        <div className="overlay" onClick={() => setMenuEl(null)} />
        <div
          className={`menu ${c("popper")}`}
          style={{
            width: 240,
          }}
        >
          {/** Edit header label section */}
          {!isMetadata && (
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
                    onMouseLeave={handleOnMouseLeaveLabel}
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
                    {getLabelHeader(input)}
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
                    {/** Childs of typesButtons */}
                    {typesButtons}
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
            {headerButtons}
          </div>
          {(!isMetadata || input === InputType.TASK) && (
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
                  onClick={() => {
                    new ColumnSettingsModal({
                      dataState: { actions: dataActions },
                      columnState: {
                        info: columnsInfo,
                        actions: columnActions,
                      },
                      configState: { info: configInfo },
                      view: table.options.meta.view,
                      headerMenuProps: headerMenuProps,
                    }).open();
                    setMenuEl(null);
                  }}
                >
                  <span className="svg-icon svg-text icon-margin">
                    <AdjustmentsIcon />
                  </span>
                  <span>Settings</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Box>
    </Popper>
  );
};

export default HeaderMenu;
