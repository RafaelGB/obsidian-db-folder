import { TableActionProps } from "cdm/MenuBarModel";
import {
  normalizeColumnsToCsvHeader,
  normalizeRowsToCsvData,
} from "parsers/NormalizeRowsToCSV";
import React, { useEffect } from "react";
import { CSVLink } from "react-csv";
import { t } from "lang/helpers";

const ExportCsvAction = (actionProps: TableActionProps) => {
  const { table } = actionProps;
  const { tableState, view } = table.options.meta;
  const columnsInfo = tableState.columns((state) => state.info);

  // Manage CSV
  const [dataForDownload, setDataForDownload] = React.useState([]);
  const [headersForDownload, setHeadersForDownload] = React.useState([]);
  const csvLink = React.useRef(null);
  const inputRef = React.useRef(null);

  // Lazily load CSV data
  const getTransactionData = async () => {
    const csvHeaders = await normalizeColumnsToCsvHeader(
      columnsInfo.getAllColumns()
    );
    const csvRows = await normalizeRowsToCsvData(table.getRowModel().rows);
    setDataForDownload(csvRows);
    setHeadersForDownload(csvHeaders);
  };

  const handleCsvDownload = (e: MouseEvent) => {
    inputRef.current.click();
  };

  useEffect(() => {
    if (!view.actionButtons.export) {
      const exportElement = view.addAction(
        "download",
        t("toolbar_menu_add_row"),
        handleCsvDownload
      );
      view.actionButtons.export = exportElement;
    }
  }, []);

  return (
    <>
      <CSVLink
        data={dataForDownload}
        headers={headersForDownload}
        asyncOnClick={true}
        onClick={getTransactionData}
        filename={`${view.diskConfig.yaml.name}.csv`}
        className="hidden"
        ref={csvLink}
        target="_blank"
      >
        <input style={{ display: "none" }} ref={inputRef} />
      </CSVLink>
    </>
  );
};

export default ExportCsvAction;
