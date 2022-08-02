import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import CalendarIcon from "components/img/CalendarIcon";
import React from "react";
import {
  ActionTypes,
  InputLabel,
  InputType,
  MetadataLabels,
} from "helpers/Constants";
import headerTypeComponent from "components/headerActions/HeaderTypeComponent";

export default class DateTypeHeaderAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addDateType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addDateType() {
    this.globalHeaderActionResponse.buttons.push(
      dateTypeComponent(this.globalHeaderActionResponse)
    );
  }
}

function dateTypeComponent(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { table, column } = headerActionResponse.headerMenuProps.headerProps;
  const dateOnClick = (e: any) => {
    table.options.meta.dispatch({
      type: ActionTypes.UPDATE_COLUMN_TYPE,
      columnId: column.id,
      input: InputType.CALENDAR_TIME,
    });
    hooks.setShowType(false);
    hooks.setExpanded(false);
  };
  return headerTypeComponent({
    onClick: dateOnClick,
    icon: <CalendarIcon />,
    label: InputLabel.CALENDAR,
  });
}
