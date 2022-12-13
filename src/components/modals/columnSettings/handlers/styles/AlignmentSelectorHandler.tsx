import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import TextAlignmentSelector from "components/styles/TextAlignmentSelector";
import { Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import React from "react";
import { createRoot } from "react-dom/client";

export class AlignmentSelectorHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
  settingTitle: string = "Content alignment selector";
  handle(
    columnHandlerResponse: ColumnSettingsHandlerResponse
  ): ColumnSettingsHandlerResponse {
    const { column, containerEl, columnSettingsManager } =
      columnHandlerResponse;

    const alignmentSetting = new Setting(containerEl)
      .setName(this.settingTitle)
      .setDesc("Change content alignment of the column");

    createRoot(alignmentSetting.controlEl.createDiv()).render(
      <TextAlignmentSelector
        modal={columnSettingsManager.modal}
        columnId={column.id}
        currentAlignment={column.config.content_alignment}
      />
    );
    return this.goNext(columnHandlerResponse);
  }
}
