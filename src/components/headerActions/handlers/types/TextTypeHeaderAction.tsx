import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import TextIcon from "components/img/Text";
import React from "react";
import { ActionTypes, InputLabel, InputType } from "helpers/Constants";
import headerTypeComponent from "components/headerActions/HeaderTypeComponent";

export default class TextTypeHeaderAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addTextType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addTextType() {
    this.globalHeaderActionResponse.buttons.push(
      textTypeComponent(this.globalHeaderActionResponse)
    );
  }
}

function textTypeComponent(headerActionResponse: HeaderActionResponse) {
  const { hooks } = headerActionResponse;
  const { table, column } = headerActionResponse.headerMenuProps.headerProps;
  const tagsOnClick = (e: any) => {
    table.options.meta.dispatch({
      type: ActionTypes.UPDATE_COLUMN_TYPE,
      columnId: column.id,
      input: InputType.TEXT,
    });
    hooks.setShowType(false);
    hooks.setExpanded(false);
  };
  return headerTypeComponent({
    onClick: tagsOnClick,
    icon: <TextIcon />,
    label: InputLabel.TEXT,
  });
}
