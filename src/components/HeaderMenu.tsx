import { InputType, StyleVariables } from "helpers/Constants";
import { dbTrim, c, getLabelHeader } from "helpers/StylesHelper";
import AdjustmentsIcon from "components/img/AdjustmentsIcon";
import React, { FocusEventHandler, useState } from "react";
import Popper from "@mui/material/Popper";
import header_action_button_section from "components/headerActions/HeaderActionButtonSection";
import header_action_types_section from "components/headerActions/HeaderActiontypesSection";
import { ColumnSettingsModal } from "components/modals/columnSettings/ColumnSettingsModal";
import { PopperTypesStyleModifiers } from "components/styles/PopperStyles";
import { TableColumn } from "cdm/FolderModel";
import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { HeaderMenuProps } from "cdm/HeaderModel";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Platform } from "obsidian";

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

  // Manage menu Popper
  const openMenu = Boolean(menuEl);
  const idMenu = openMenu ? `header-menu-popper` : undefined;

  // Manage type Popper
  const [typesEl, setTypesEl] = useState<null | HTMLElement>(null);
  const [typesTimeout, setTypesTimeout] = useState(null);

  const isTypesShown = Boolean(typesEl);
  const idTypes = isTypesShown ? `types-menu-popper` : undefined;

  // Manage errors
  const [labelStateInvalid, setLabelStateInvalid] = useState(false);

  /**
   * Array of action buttons asociated to the header
   */
  let headerActionResponse: HeaderActionResponse = {
    buttons: [],
    headerMenuProps: headerMenuProps,
    hooks: {
      setMenuEl: setMenuEl,
      setTypesEl: setTypesEl,
      keyState: keyState,
      setKeyState: setkeyState,
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

  const handleClickAway = () => {
    setMenuEl(null);
    setTypesEl(null);
    setTypesTimeout(null);
  };

  return (
    <Popper id={idMenu} open={openMenu} anchorEl={menuEl} key={idMenu}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box>
          <div
            className={`menu ${c("popper")}`}
            style={{
              width: Platform.isMobile ? "240px" : "auto",
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
                    onMouseOver={async (event) => {
                      setTypesEl(event.currentTarget);
                    }}
                    onMouseLeave={() => {
                      const timeoutId = setTimeout(() => {
                        setTypesEl(null);
                        setTypesTimeout(null);
                        // timeout until event is triggered after user has stopped typing
                      }, 250);
                      setTypesTimeout(timeoutId);
                    }}
                  >
                    <span className="svg-icon svg-text icon-margin">
                      {propertyIcon}
                    </span>
                    <span style={{ textTransform: "capitalize" }}>
                      {getLabelHeader(input)}
                    </span>
                  </div>
                  <Popper
                    id={idTypes}
                    open={isTypesShown}
                    anchorEl={typesEl}
                    placement="right"
                    disablePortal={false}
                    key={idTypes}
                    modifiers={PopperTypesStyleModifiers()}
                    onMouseOver={() => {
                      if (typesTimeout) {
                        clearTimeout(typesTimeout);
                        setTypesTimeout(null);
                      }
                    }}
                    onMouseLeave={async () => {
                      setTypesEl(null);
                    }}
                  >
                    <Box className={`menu ${c("popper")}`}>
                      {/** Childs of typesButtons */}
                      {typesButtons}
                    </Box>
                  </Popper>
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
      </ClickAwayListener>
    </Popper>
  );
};

export default HeaderMenu;
