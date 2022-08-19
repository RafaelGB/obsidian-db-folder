import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import HashIcon from "components/img/Hash";
import React from "react";
import { InputLabel, InputType } from "helpers/Constants";
import headerTypeComponent from "components/headerActions/HeaderTypeComponent";
import { TableColumn } from "cdm/FolderModel";

export default class NumberTypeHeaderAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addNumberType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addNumberType() {
    this.globalHeaderActionResponse.buttons.push(
      numberTypeComponent(this.globalHeaderActionResponse)
    );
  }
}
function numberTypeComponent(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { table, column } = headerActionResponse.headerMenuProps.headerProps;
  const columnActions = table.options.meta.tableState.columns(
    (state) => state.actions
  );
  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );
  const ddbbConfig = table.options.meta.tableState.configState(
    (state) => state.ddbbConfig
  );

  const numberOnClick = (e: any) => {
    hooks.setShowType(false);
    hooks.setExpanded(false);
    dataActions.parseDataOfColumn(
      column.columnDef as TableColumn,
      InputType.NUMBER,
      ddbbConfig
    );
    columnActions.alterColumnType(
      column.columnDef as TableColumn,
      InputType.NUMBER
    );
  };
  return headerTypeComponent({
    onClick: numberOnClick,
    icon: <HashIcon />,
    label: InputLabel.NUMBER,
  });
}
