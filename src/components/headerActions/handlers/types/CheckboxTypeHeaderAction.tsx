import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import React from "react";
import { ActionTypes, InputType } from "helpers/Constants";
import TaskIcon from "components/img/TaskIcon";
import headerTypeComponent from "components/headerActions/HeaderTypeComponent";
import { TableColumn } from "cdm/FolderModel";

export default class CheckboxTypeHandlerAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addCheckboxType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addCheckboxType() {
    this.globalHeaderActionResponse.buttons.push(
      checkboxTypeComponent(this.globalHeaderActionResponse)
    );
  }
}

function checkboxTypeComponent(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { table, column } = headerActionResponse.headerMenuProps.headerProps;
  const alterColumnType = table.options.meta.tableState.columns(
    (state) => state.alterColumnType
  );
  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );
  const ddbbConfig = table.options.meta.tableState.configState(
    (state) => state.ddbbConfig
  );
  const checkBoxTypeOnClick = (e: any) => {
    hooks.setShowType(false);
    hooks.setExpanded(false);
    dataActions.parseDataOfColumn(
      column.columnDef as TableColumn,
      InputType.CHECKBOX,
      ddbbConfig
    );
    alterColumnType(column.columnDef as TableColumn, InputType.CHECKBOX);
  };
  return headerTypeComponent({
    onClick: checkBoxTypeOnClick,
    icon: <TaskIcon />,
    label: InputType.CHECKBOX,
  });
}
