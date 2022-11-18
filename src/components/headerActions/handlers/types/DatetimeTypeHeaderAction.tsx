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
import { TableColumn } from "cdm/FolderModel";

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
  const columnActions = table.options.meta.tableState.columns(
    (state) => state.actions
  );
  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );
  const ddbbConfig = table.options.meta.tableState.configState(
    (state) => state.ddbbConfig
  );

  const datetimeOnClick = async () => {
    hooks.setTypesEl(null);
    hooks.setMenuEl(null);
    await dataActions.parseDataOfColumn(
      column.columnDef as TableColumn,
      InputType.CALENDAR_TIME,
      ddbbConfig
    );
    await columnActions.alterColumnType(
      column.columnDef as TableColumn,
      InputType.CALENDAR_TIME
    );
  };

  return headerTypeComponent({
    onClick: datetimeOnClick,
    icon: <CalendarTimeIcon />,
    label: InputLabel.CALENDAR_TIME,
  });
}
