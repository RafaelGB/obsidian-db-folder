import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { RowTemplateOption } from "cdm/FolderModel";
import { AddRowProps } from "cdm/MenuBarModel";
import { c } from "helpers/StylesHelper";
import React, { KeyboardEventHandler, useRef, useState } from "react";
import Select, { OnChangeValue } from "react-select";
import PlusIcon from "components/img/Plus";
import CustomTemplateSelectorStyles from "components/styles/RowTemplateStyles";

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
  // Manage input of new row
  const [inputNewRow, setInputNewRow] = useState("");
  const newRowRef = useRef(null);
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      handleAddNewRow();
    }
  };

  function handleAddNewRow() {
    dataActions.addRow(
      inputNewRow,
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings()
    );
    setInputNewRow("");
    newRowRef.current.value = "";
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
    <Box sx={{ flexGrow: 1 }} className={`${c("add-row")}`}>
      {/* INIT NEW ROW */}
      <Toolbar>
        <input
          type="text"
          ref={newRowRef}
          onChange={(e) => {
            setInputNewRow(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="filename of new row"
        />
        <div key={`div-add-row-cell-button`} onClick={handleAddNewRow}>
          <span className="svg-icon svg-gray">
            <PlusIcon />
          </span>
        </div>
        <Box
          justifyContent={"flex-start"}
          sx={{
            display: { xs: "none", md: "flex" },
          }}
        >
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
            placeholder={"Without template. Select one to use..."}
            menuPortalTarget={document.body}
            menuShouldBlockScroll={true}
            isSearchable
            menuPlacement="top"
          />
        </Box>
      </Toolbar>
      {/* ENDS NEW ROW */}
    </Box>
  );
}
