import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import MultiIcon from "components/img/Multi";
import React from "react";
import { InputLabel, InputType } from "helpers/Constants";
import headerTypeComponent from "components/headerActions/HeaderTypeComponent";
import { TableColumn } from "cdm/FolderModel";

export default class SelectTypeHeaderAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addSelectType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addSelectType() {
    this.globalHeaderActionResponse.buttons.push(
      selectTypeComponent(this.globalHeaderActionResponse)
    );
  }
}
function selectTypeComponent(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { table, column } = headerActionResponse.headerMenuProps.headerProps;
  const { tableState } = table.options.meta;
  const columnActions = tableState.columns((state) => state.actions);
  const rows = tableState.data((state) => state.rows);
  const dataActions = tableState.data((state) => state.actions);

  const configInfo = tableState.configState((state) => state.info);

  const selectOnClick = async () => {
    hooks.setTypesEl(null);
    hooks.setMenuEl(null);

    dataActions.parseDataOfColumn(
      column.columnDef as TableColumn,
      InputType.SELECT,
      configInfo.getLocalSettings()
    );

    await columnActions.alterColumnType(
      column.columnDef as TableColumn,
      InputType.SELECT,
      rows
    );
  };

  return headerTypeComponent({
    onClick: selectOnClick,
    icon: <MultiIcon />,
    label: InputLabel.SELECT,
  });
}
