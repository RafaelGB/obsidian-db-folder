import { Notice, Setting } from "obsidian";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { dbTrim } from "helpers/StylesHelper";
import { TableColumn } from "cdm/FolderModel";
import { t } from "lang/helpers";

export class ColumnIdInputHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle = t("column_settings_modal_column_id_title");
    handle(response: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = response;
        const { columnsState, dataState, configState } = columnSettingsManager.modal;
        let value = `${column.key}${column.nestedKey ? `.${column.nestedKey}` : ''}`;
        new Setting(containerEl)
            .setName(this.settingTitle)
            .setDesc(t("column_settings_modal_column_id_desc"))
            .addText(text => {
                text.setPlaceholder("Write your nested key...")
                    .setValue(value)
                    .onChange((newId: string) => {
                        value = dbTrim(newId);
                    })
            }).addExtraButton((cb) => {
                cb.setIcon("save")
                    .setTooltip(t("column_settings_modal_column_id_button_tooltip"))
                    .onClick(async (): Promise<void> => {
                        const arrayKey = value.split('.');
                        const rootKey = arrayKey.shift();
                        const validateMessage = this.validateNewId(rootKey, arrayKey, columnsState.info.getAllColumns());
                        if (validateMessage) {
                            new Notice(
                                t("column_settings_modal_column_id_notice_error_on_save", validateMessage),
                                3000);
                            return;
                        }
                        // Update state of altered column
                        await columnsState.actions
                            .alterColumnId(column, rootKey, arrayKey);

                        if (rootKey !== column.key) {
                            // Update key of all notes
                            await dataState.actions.updateDataAfterLabelChange(
                                column,
                                rootKey,
                                columnsState.info.getAllColumns(),
                                configState.info.getLocalSettings()
                            )
                            // Rename column in group_folder_column
                            const groupFolderColumn = configState.info.getLocalSettings().group_folder_column.split(",");
                            if (groupFolderColumn.includes(column.key)) {
                                const newGroupFolderColumn = groupFolderColumn
                                    .map((item) => (item === column.key ? rootKey : item))
                                    .join(",");
                                configState.actions.alterConfig({ group_folder_column: newGroupFolderColumn });
                                // Reorganize files and remove empty folders
                                await dataState.actions.groupFiles();
                            }
                        }
                        new Notice(
                            t("column_settings_modal_column_id_notice_success_on_save", value),
                            1500
                        );
                        columnSettingsManager.modal.enableReset = true;
                    });
            });


        return this.goNext(response);
    }
    private validateNewId(rootKey: string, arrayKey: string[], columns: TableColumn[]): string {
        const candidateId = `${rootKey}${arrayKey.length > 0 ? `-${arrayKey.join('-')}` : ''}`;
        // Check if new root key is not empty
        if (!rootKey) {
            return t("column_settings_modal_column_id_error_empty_root_key");
        }
        // Validate special characters in root key
        if (rootKey.match(/[^a-zA-Z0-9_]/)) {
            return t("column_settings_modal_column_id_error_invalid_key");
        }
        // Validate if new root key is not duplicated
        const conflictId = columns.some((column: TableColumn) =>
            column.id === candidateId
        );
        if (conflictId) {
            return t("column_settings_modal_column_id_error_already_exists");
        }
        return '';
    }
}