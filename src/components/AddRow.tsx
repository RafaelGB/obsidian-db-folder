import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { RowTemplateOption } from "cdm/FolderModel";
import { AddRowProps } from "cdm/MenuBarModel";
import { c } from "helpers/StylesHelper";
import React, { KeyboardEventHandler, useRef, useState } from "react";
import Select, { OnChangeValue } from "react-select";
import CustomTemplateSelectorStyles from "components/styles/RowTemplateStyles";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { StyleVariables } from "helpers/Constants";

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
      variant="outlined"
      aria-label="Add new row"
      className={`${c("add-row")}`}
      size="small"
      sx={{
        padding: 0.5,
      }}
    >
      <Button
        key={`div-add-row-cell-button`}
        onClick={() => setShowNewRow(!showNewRow)}
        size="small"
        sx={{
          bgcolor: StyleVariables.BACKGROUND_PRIMARY,
          color: StyleVariables.TEXT_NORMAL,
          ":hover": {
            bgcolor: StyleVariables.BACKGROUND_SECONDARY,
            color: StyleVariables.TEXT_NORMAL,
          },
        }}
      >
        <span className="svg-icon svg-gray">
          {showNewRow ? <CloseIcon /> : <AddIcon />}
        </span>
      </Button>
      {/* INIT NEW ROW */}
      {showNewRow && (
        <>
          <Input
            type="text"
            value={inputNewRow}
            size="small"
            autoFocus
            onChange={(e) => {
              setInputNewRow(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="filename of new row"
          />
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
