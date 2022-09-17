import MenuItem from "@mui/material/MenuItem";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import React, { ChangeEventHandler, MouseEventHandler, useRef } from "react";
import { MenuButtonStyle } from "components/styles/NavBarStyles";
import { NavBarProps } from "cdm/MenuBarModel";
import { t } from "lang/helpers";

export default function CsvReader(navBarProps: NavBarProps) {
  const { table } = navBarProps;
  const { tableState } = table.options.meta;
  const columnsInfo = tableState.columns((state) => state.info);
  const configInfo = tableState.configState((state) => state.info);
  const dataActions = tableState.data((state) => state.actions);
  const inputRef = useRef(null);

  const handleFileUpload: MouseEventHandler<HTMLLIElement> = (e) => {
    inputRef.current.click();
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const csvFile = e.target.files[0];
    if (csvFile) {
      dataActions.saveDataFromFile(
        csvFile,
        columnsInfo.getAllColumns(),
        configInfo.getLocalSettings()
      );
    }
  };

  return (
    <MenuItem disableRipple onClick={handleFileUpload}>
      <FileUploadIcon {...MenuButtonStyle} />
      {t("toolbar_menu_import_csv")}
      {/* Hidden input element to trigger file upload */}
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </MenuItem>
  );
}
