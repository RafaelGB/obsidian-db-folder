import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { RowTemplateOption } from "cdm/FolderModel";
import { AddRowProps } from "cdm/MenuBarModel";
import { c } from "helpers/StylesHelper";
import React, { KeyboardEventHandler, useState } from "react";
import Select, { OnChangeValue } from "react-select";
import CustomTemplateSelectorStyles from "components/styles/RowTemplateStyles";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { StyleVariables } from "helpers/Constants";
import Divider from "@mui/material/Divider";

export function AddRow(props: AddRowProps) {
  const { table } = props;
  const { tableState } = table.options.meta;
  const dataActions = tableState.data((state) => state.actions);
  const columnsInfo = tableState.columns((state) => state.info);
  const configInfo = tableState.configState((state) => state.info);
  const configActions = tableState.configState((state) => state.actions);
  // new Row Template
  const [templateRow, templateOptions, templateUpdate] = tableState.rowTemplate(
    (store) => [store.template, store.options, store.update]
  );
  const [showNewRow, setShowNewRow] = useState(false);

  const [inputNewRow, setInputNewRow] = useState("");
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    switch (event.key) {
      case "Enter":
        handleAddNewRow();
        break;
      case "Escape":
        setShowNewRow(false);
        setInputNewRow("");
        break;
      default:
      // Do nothing
    }
  };

  function handleAddNewRow() {
    dataActions
      .addRow(
        inputNewRow,
        columnsInfo.getAllColumns(),
        configInfo.getLocalSettings()
      )
      .then(() => {
        setInputNewRow("");
        table.setPageIndex(table.getPageCount() - 1);
      });
  }

  const handleChangeRowTemplate = (
    newValue: OnChangeValue<RowTemplateOption, false>
  ) => {
    const settingsValue = !!newValue ? newValue.value : "";
    templateUpdate(settingsValue);
    configActions.alterConfig({
      current_row_template: settingsValue,
    });
  };
  return (
    <ButtonGroup
      variant="text"
      className={`${c("add-row")}`}
      size="small"
      sx={{
        bordercolor: StyleVariables.TEXT_NORMAL,
        border: 0,
      }}
    >
      <Button
        key={`div-add-row-cell-button`}
        onClick={() => {
          setInputNewRow("");
          setShowNewRow(!showNewRow);
        }}
        sx={{
          bgcolor: StyleVariables.BACKGROUND_PRIMARY,
          color: StyleVariables.TEXT_NORMAL,
          ":hover": {
            bgcolor: StyleVariables.BACKGROUND_SECONDARY,
            color: StyleVariables.TEXT_NORMAL,
            border: 0,
          },
          border: 0,
        }}
        style={{ minWidth: "30px" }}
      >
        {showNewRow ? (
          <CloseIcon />
        ) : (
          <AddIcon
            style={{
              border: 0,
              fontSize: "1.35rem",
            }}
          />
        )}
      </Button>
      {/* INIT NEW ROW */}
      {showNewRow && (
        <>
          <Divider orientation="vertical" flexItem />
          <input
            type="text"
            value={inputNewRow}
            className={`${c("add-row-input")}`}
            autoFocus
            onChange={(e) => {
              setInputNewRow(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="filename of new row"
          />
          <Divider orientation="vertical" flexItem />
          <Select
            styles={CustomTemplateSelectorStyles}
            options={templateOptions}
            value={
              templateRow
                ? {
                    label: templateRow,
                    value: templateRow,
                  }
                : null
            }
            isClearable={true}
            isMulti={false}
            onChange={handleChangeRowTemplate}
            placeholder={"Select template..."}
            menuPortalTarget={document.body}
            menuShouldBlockScroll={true}
            isSearchable
            menuPlacement="top"
          />
          {/* ENDS NEW ROW */}
        </>
      )}
    </ButtonGroup>
  );
}
