import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import React from "react";
import { ActionTypes, InputType } from "helpers/Constants";
import TagsIcon from "components/img/TagsIcon";

export default class TagsTypeHeaderAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addTagsType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addTagsType() {
    const { hooks } = this.globalHeaderActionResponse;
    const { table, column } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    const checkBoxType = {
      onClick: (e: any) => {
        (table.options.meta as any).dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: column.id,
          input: InputType.TAGS,
        });
        hooks.setShowType(false);
        hooks.setExpanded(false);
      },
      icon: <TagsIcon />,
      label: InputType.TAGS,
    };
    this.globalHeaderActionResponse.buttons.push(checkBoxType);
  }
}
