import { CsvButtonProps } from "cdm/MenuBarModel";
import {
  normalizeColumnsToCsvHeader,
  normalizeRowsToCsvData,
} from "parsers/NormalizeRowsToCSV";
import React from "react";
import { CSVLink } from "react-csv";
import DownloadIcon from "@mui/icons-material/Download";
import { MenuButtonStyle } from "components/styles/NavBarStyles";

const CsvButton = (CsvButtonProps: CsvButtonProps) => {
  const { columns, rows, name } = CsvButtonProps;
  // Manage CSV
  const [dataForDownload, setDataForDownload] = React.useState([]);
  const [headersForDownload, setHeadersForDownload] = React.useState([]);
  const csvLink = React.useRef(null);

  // Lazily load CSV data
  const getTransactionData = async () => {
    const csvHeaders = await normalizeColumnsToCsvHeader(columns);
    const csvRows = await normalizeRowsToCsvData(rows);
    setDataForDownload(csvRows);
    setHeadersForDownload(csvHeaders);
  };

  return (
    <>
      <CSVLink
        data={dataForDownload}
        headers={headersForDownload}
        asyncOnClick={true}
        onClick={getTransactionData}
        filename={`${name}.csv`}
        className="hidden"
        ref={csvLink}
        target="_blank"
      >
        <DownloadIcon {...MenuButtonStyle} />
        Download CSV
      </CSVLink>
    </>
  );
};

export default CsvButton;
