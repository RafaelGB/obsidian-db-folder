import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import React from "react";
import { ActionTypes, InputType } from "helpers/Constants";
import TaskIcon from "components/img/TaskIcon";
import headerTypeComponent from "components/headerActions/HeaderTypeComponent";

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
  const checkBoxTypeOnClick = (e: any) => {
    table.options.meta.dispatch({
      type: ActionTypes.UPDATE_COLUMN_TYPE,
      columnId: column.id,
      input: InputType.CHECKBOX,
    });
    hooks.setShowType(false);
    hooks.setExpanded(false);
  };
  return headerTypeComponent({
    onClick: checkBoxTypeOnClick,
    icon: <TaskIcon />,
    label: InputType.CHECKBOX,
  });
}
