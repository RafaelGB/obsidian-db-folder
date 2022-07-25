import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import MultiIcon from "components/img/Multi";
import React from "react";
import { ActionTypes, InputType } from "helpers/Constants";

export default class SelectTypeHeaderAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addSelectType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addSelectType() {
    const { hooks } = this.globalHeaderActionResponse;
    const { table, column } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    const selectType = {
      onClick: (e: any) => {
        (table.options.meta as any).dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: column.id,
          dataType: InputType.SELECT,
        });
        hooks.setShowType(false);
        hooks.setExpanded(false);
      },
      icon: <MultiIcon />,
      label: InputType.SELECT,
    };
    this.globalHeaderActionResponse.buttons.push(selectType);
  }
}
