import { Notice, Setting } from "obsidian";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { dbTrim } from "helpers/StylesHelper";

export class ColumnIdInputHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle: string = 'Column id';
    handle(response: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = response;
        const { view, columnsState, dataState, configState } = columnSettingsManager.modal;
        let value = `${column.id}${column.nestedId ? `.${column.nestedId}` : ''}`;
        new Setting(containerEl)
            .setName(this.settingTitle)
            .setDesc("Enter the column id of the column")
            .addText(text => {
                text.setPlaceholder("Write your nested key...")
                    .setValue(value)
                    .onChange((newId: string) => {
                        value = dbTrim(newId);
                    })
            }).addExtraButton((cb) => {
                cb.setIcon("save")
                    .setTooltip("Save column id")
                    .onClick(async (): Promise<void> => {
                        const arrayId = value.split('.');
                        const rootId = arrayId.shift();
                        if (rootId) {
                            // Update state of altered column
                            columnsState.actions
                                .alterColumnId(column, rootId, arrayId)
                                .then(() => {
                                    if (rootId !== column.id) {
                                        // Update key of all notes
                                        dataState.actions.updateDataAfterLabelChange(
                                            column,
                                            rootId,
                                            columnsState.info.getAllColumns(),
                                            configState.info.getLocalSettings()
                                        ).then(() => {
                                            // Rename column in group_folder_column
                                            const groupFolderColumn = configState.info.getLocalSettings().group_folder_column.split(",");
                                            if (groupFolderColumn.includes(column.id)) {
                                                const newGroupFolderColumn = groupFolderColumn
                                                    .map((item) => (item === column.id ? rootId : item))
                                                    .join(",");
                                                configState.actions.alterConfig({ group_folder_column: newGroupFolderColumn });
                                                // Reorganize files and remove empty folders
                                                dataState.actions.groupFiles();
                                            }
                                        });
                                    }
                                    new Notice(`new column id was saved: ${value}`, 1500);
                                });
                        } else {
                            new Notice(`column id is required`, 1500);
                        }
                        columnSettingsManager.modal.enableReset = true;
                    });
            });


        return this.goNext(response);
    }
}