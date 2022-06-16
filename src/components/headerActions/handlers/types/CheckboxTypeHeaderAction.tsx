import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import React from "react";
import { ActionTypes, DataTypes } from "helpers/Constants";
import TaskIcon from "components/img/TaskIcon";

export default class CheckboxTypeHandlerAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addCheckboxType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addCheckboxType() {
    const { hooks } = this.globalHeaderActionResponse;
    const { tableData, column } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    const checkBoxType = {
      onClick: (e: any) => {
        tableData.dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: column.id,
          dataType: DataTypes.CHECKBOX,
        });
        hooks.setShowType(false);
        hooks.setExpanded(false);
      },
      icon: <TaskIcon />,
      label: DataTypes.CHECKBOX,
    };
    this.globalHeaderActionResponse.buttons.push(checkBoxType);
  }
}
