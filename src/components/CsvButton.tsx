import Button from "@mui/material/Button";
import { CsvButtonProps } from "cdm/MenuBarModel";
import {
  normalizeColumnsToCsvHeader,
  normalizeRowsToCsvData,
} from "parsers/NormalizeRowsToCSV";
import React from "react";
import { CSVLink } from "react-csv";
import DownloadIcon from "components/img/DownloadIcon";

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
    csvLink.current.link.click();
  };

  return (
    <>
      <Button onClick={getTransactionData}>
        <DownloadIcon />
        CSV
      </Button>
      <CSVLink
        data={dataForDownload}
        headers={headersForDownload}
        filename={`${name}.csv`}
        className="hidden"
        ref={csvLink}
        target="_blank"
      />
    </>
  );
};

export default CsvButton;
