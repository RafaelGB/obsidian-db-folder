import MenuItem from "@mui/material/MenuItem";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import React, { ChangeEventHandler, MouseEventHandler, useRef } from "react";
import { MenuButtonStyle } from "components/styles/NavBarStyles";

export default function CsvReader() {
  const inputRef = useRef(null);

  const handleFileUpload: MouseEventHandler<HTMLLIElement> = (e) => {
    inputRef.current.click();
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const csvFile = e.target.files[0];
    console.log(csvFile);
  };

  return (
    <MenuItem disableRipple onClick={handleFileUpload}>
      <FileUploadIcon {...MenuButtonStyle} />
      Upload CSV
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
