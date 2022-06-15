import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import CalendarIcon from "components/img/CalendarIcon";
import React from "react";
import { ActionTypes, DataTypes, MetadataLabels } from "helpers/Constants";

export default class DateTypeHeaderAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addDateType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addDateType() {
    const { hooks } = this.globalHeaderActionResponse;
    const { tableData, column } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    const checkBoxType = {
      onClick: (e: any) => {
        tableData.dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: column.id,
          dataType: DataTypes.CALENDAR,
        });
        hooks.setShowType(false);
        hooks.setExpanded(false);
      },
      icon: <CalendarIcon />,
      label: MetadataLabels.CALENDAR,
    };
    this.globalHeaderActionResponse.buttons.push(checkBoxType);
  }
}
