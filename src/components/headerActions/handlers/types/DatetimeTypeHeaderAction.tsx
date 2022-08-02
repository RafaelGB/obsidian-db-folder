import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import React from "react";
import {
  ActionTypes,
  InputLabel,
  InputType,
  MetadataLabels,
} from "helpers/Constants";
import CalendarTimeIcon from "components/img/CalendarTime";
import headerTypeComponent from "components/headerActions/HeaderTypeComponent";

export default class DatetimeTypeHeaderAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addDatetimeType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addDatetimeType() {
    this.globalHeaderActionResponse.buttons.push(
      datetimeTypeComponent(this.globalHeaderActionResponse)
    );
  }
}

function datetimeTypeComponent(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { table, column } = headerActionResponse.headerMenuProps.headerProps;
  const datetimeOnClick = (e: any) => {
    table.options.meta.dispatch({
      type: ActionTypes.UPDATE_COLUMN_TYPE,
      columnId: column.id,
      input: InputType.CALENDAR_TIME,
    });
    hooks.setShowType(false);
    hooks.setExpanded(false);
  };
  return headerTypeComponent({
    onClick: datetimeOnClick,
    icon: <CalendarTimeIcon />,
    label: InputLabel.CALENDAR_TIME,
  });
}
