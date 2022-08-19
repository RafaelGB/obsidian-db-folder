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
import { TableColumn } from "cdm/FolderModel";

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
  const alterColumnType = table.options.meta.tableState.columns(
    (state) => state.alterColumnType
  );
  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );
  const ddbbConfig = table.options.meta.tableState.configState(
    (state) => state.ddbbConfig
  );
  const dateOnClick = (e: any) => {
    hooks.setShowType(false);
    hooks.setExpanded(false);
    dataActions.parseDataOfColumn(
      column.columnDef as TableColumn,
      InputType.CALENDAR,
      ddbbConfig
    );
    alterColumnType(column.columnDef as TableColumn, InputType.CALENDAR);
  };

  return headerTypeComponent({
    onClick: dateOnClick,
    icon: <CalendarIcon />,
    label: InputLabel.CALENDAR,
  });
}
