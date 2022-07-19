import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import TextIcon from "components/img/Text";
import React from "react";
import { ActionTypes, DataTypes } from "helpers/Constants";

export default class TextTypeHeaderAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addTextType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addTextType() {
    const { hooks } = this.globalHeaderActionResponse;
    const { table, column } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    const textBoxType = {
      onClick: (e: any) => {
        (table.options.meta as any).dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: column.id,
          dataType: DataTypes.TEXT,
        });
        hooks.setShowType(false);
        hooks.setExpanded(false);
      },
      icon: <TextIcon />,
      label: DataTypes.TEXT,
    };
    this.globalHeaderActionResponse.buttons.push(textBoxType);
  }
}
