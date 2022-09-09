import MenuItem from "@mui/material/MenuItem";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import React, { MouseEventHandler, useRef } from "react";
import { useState } from "react";
import { MenuButtonStyle } from "components/styles/NavBarStyles";

export default function CsvReader() {
  const [csvFile, setCsvFile] = useState(null);

  const inputRef = useRef(null);

  const handleFileUpload: MouseEventHandler<HTMLLIElement> = (e) => {
    inputRef.current.click();
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
        onChange={(e) => {
          setCsvFile(e.target.files[0]);
        }}
      />
    </MenuItem>
  );
}
