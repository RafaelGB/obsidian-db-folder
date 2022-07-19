import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import HashIcon from "components/img/Hash";
import React from "react";
import { ActionTypes, DataTypes } from "helpers/Constants";

export default class NumberTypeHeaderAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addNumberType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addNumberType() {
    const { hooks } = this.globalHeaderActionResponse;
    const { table, column } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    const checkBoxType = {
      onClick: (e: any) => {
        (table.options.meta as any).dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: column.id,
          dataType: DataTypes.NUMBER,
        });
        hooks.setShowType(false);
        hooks.setExpanded(false);
      },
      icon: <HashIcon />,
      label: DataTypes.NUMBER,
    };
    this.globalHeaderActionResponse.buttons.push(checkBoxType);
  }
}
