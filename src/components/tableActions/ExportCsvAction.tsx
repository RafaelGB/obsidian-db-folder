import { TableActionProps } from "cdm/MenuBarModel";
import React, { useEffect } from "react";
import { t } from "lang/helpers";
import { RowDataType } from "cdm/FolderModel";
import { CsvHeaders } from "cdm/ServicesModel";
import { CsvParserService } from "services/csv/CsvParserService";
import { ParseService } from "services/ParseService";
import { InputType } from "helpers/Constants";
import { CustomView } from "views/AbstractView";
import { Literal } from "obsidian-dataview";

const ExportCsvAction = (actionProps: TableActionProps) => {
  const { table } = actionProps;
  const { tableState, view } = table.options.meta;
  const columnsInfo = tableState.columns((state) => state.info);

  // Manage CSV
  const inputRef = React.useRef(null);

  // Lazily load CSV data
  const getTransactionData = async () => {
    const csvHeaders = CsvParserService.getCsvHeaders(
      columnsInfo.getAllColumns()
    );
    const csvRows = CsvParserService.normalizeRowsToCsvData(
      table.getRowModel().rows
    );

    exportToCsv(`${view.diskConfig.yaml.name}.csv`, csvRows, csvHeaders, view);
  };

  const handleCsvDownload = (e: MouseEvent) => {
    inputRef.current.click();
  };

  useEffect(() => {
    if (!view.actionButtons.export) {
      const exportElement = view.addAction(
        "download",
        t("toolbar_menu_export_csv"),
        handleCsvDownload
      );
      view.actionButtons.export = exportElement;
    }
  }, []);

  return (
    <>
      <div onClick={getTransactionData} className="hidden">
        <input style={{ display: "none" }} ref={inputRef} />
      </div>
    </>
  );
};

export const exportToCsv = (
  filename: string,
  rows: RowDataType[],
  headers: CsvHeaders[],
  view: CustomView
): void => {
  if (!rows || !rows.length) {
    return;
  }
  const separator: string = ",";

  const keys: string[] = headers.map((header) => header.key);

  const columHearders = headers.map((header) => header.label);

  const csvContent =
    columHearders.join(separator) +
    "\n" +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? "" : row[k];

            cell = ParseService.parseLiteral(
              cell as Literal,
              InputType.MARKDOWN,
              view.diskConfig.yaml.config
            ) as string;

            if (cell.toString().search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  if (link.download !== undefined) {
    // Browsers that support HTML5 download attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default ExportCsvAction;
