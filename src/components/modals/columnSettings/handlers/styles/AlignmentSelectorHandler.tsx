import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import TextAlignmentSelector from "components/styles/TextAlignmentSelector";
import { t } from "lang/helpers";
import { Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import React from "react";
import { createRoot } from "react-dom/client";

export class AlignmentSelectorHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
  settingTitle = t("column_settings_modal_aligment_select_title");
  handle(
    columnHandlerResponse: ColumnSettingsHandlerResponse
  ): ColumnSettingsHandlerResponse {
    const { column, containerEl, columnSettingsManager } =
      columnHandlerResponse;

    const alignmentSetting = new Setting(containerEl)
      .setName(this.settingTitle)
      .setDesc(t("column_settings_modal_aligment_select_desc"));

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
