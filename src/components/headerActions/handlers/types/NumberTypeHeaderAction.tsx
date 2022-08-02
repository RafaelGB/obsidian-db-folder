import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import HashIcon from "components/img/Hash";
import React from "react";
import { ActionTypes, InputLabel, InputType } from "helpers/Constants";
import headerTypeComponent from "components/headerActions/HeaderTypeComponent";

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
  const numberOnClick = (e: any) => {
    table.options.meta.dispatch({
      type: ActionTypes.UPDATE_COLUMN_TYPE,
      columnId: column.id,
      input: InputType.NUMBER,
    });
    hooks.setShowType(false);
    hooks.setExpanded(false);
  };
  return headerTypeComponent({
    onClick: numberOnClick,
    icon: <HashIcon />,
    label: InputLabel.NUMBER,
  });
}
