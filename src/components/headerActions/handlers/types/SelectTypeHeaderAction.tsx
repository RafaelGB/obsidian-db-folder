import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import MultiIcon from "components/img/Multi";
import React from "react";
import { ActionTypes, InputLabel, InputType } from "helpers/Constants";
import headerTypeComponent from "components/headerActions/HeaderTypeComponent";

export default class SelectTypeHeaderAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addSelectType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addSelectType() {
    this.globalHeaderActionResponse.buttons.push(
      selectTypeComponent(this.globalHeaderActionResponse)
    );
  }
}
function selectTypeComponent(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { table, column } = headerActionResponse.headerMenuProps.headerProps;
  const selectOnClick = (e: any) => {
    table.options.meta.dispatch({
      type: ActionTypes.UPDATE_COLUMN_TYPE,
      columnId: column.id,
      input: InputType.SELECT,
    });
    hooks.setShowType(false);
    hooks.setExpanded(false);
  };
  return headerTypeComponent({
    onClick: selectOnClick,
    icon: <MultiIcon />,
    label: InputLabel.SELECT,
  });
}
