import React, { ChangeEventHandler, useEffect, useRef } from "react";
import { TableActionProps } from "cdm/MenuBarModel";
import { t } from "lang/helpers";

export default function ImportCsvAction(actionProps: TableActionProps) {
  const { table } = actionProps;
  const { tableState, view } = table.options.meta;
  const columnsInfo = tableState.columns((state) => state.info);
  const configInfo = tableState.configState((state) => state.info);
  const dataActions = tableState.data((state) => state.actions);
  const inputRef = useRef(null);

  const handleFileUpload = (e: MouseEvent) => {
    inputRef.current.click();
  };

  useEffect(() => {
    const isActionEnabled = activeDocument.querySelector(
      `div .view-actions a[aria-label='${t("toolbar_menu_import_csv")}']`
    );
    if (!isActionEnabled) {
      view.addAction("import", t("toolbar_menu_import_csv"), handleFileUpload);
    }
  }, []);

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
    <input
      ref={inputRef}
      type="file"
      accept=".csv"
      style={{ display: "none" }}
      onChange={handleFileChange}
    />
  );
}
