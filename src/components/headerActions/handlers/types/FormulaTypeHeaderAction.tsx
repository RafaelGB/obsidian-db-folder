import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import React from "react";
import { InputLabel, InputType } from "helpers/Constants";
import headerTypeComponent from "components/headerActions/HeaderTypeComponent";
import { TableColumn } from "cdm/FolderModel";
import CodeIcon from "components/img/CodeIcon";

export default class FormulaTypeHeaderAction extends AbstractHeaderAction {
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

  const formulaOnClick = async () => {
    hooks.setTypesEl(null);
    hooks.setMenuEl(null);
    dataActions.parseDataOfColumn(
      column.columnDef as TableColumn,
      InputType.FORMULA,
      ddbbConfig
    );

    await columnActions.alterColumnType(
      column.columnDef as TableColumn,
      InputType.FORMULA
    );
  };

  return headerTypeComponent({
    onClick: formulaOnClick,
    icon: <CodeIcon />,
    label: InputLabel.FORMULA,
  });
}
