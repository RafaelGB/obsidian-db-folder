import { Setting } from "obsidian";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { dbTrim } from "helpers/StylesHelper";

export class ColumnIdInputHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle: string = 'Column id';
    handle(response: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = response;
        const { view, columnsState, dataState, configState } = columnSettingsManager.modal;
        let value = column.nestedId ?? column.id;
        new Setting(containerEl)
            .setName(this.settingTitle)
            .setDesc("Enter the column id of the column")
            .addText(text => {
                text.setPlaceholder("Write your nested key...")
                    .setValue(value)
                    .onChange(async (newId: string): Promise<void> => {
                        value = dbTrim(newId);
                    })
            }).addExtraButton((cb) => {
                cb.setIcon("save")
                    .setTooltip("Save column id")
                    .onClick(async (): Promise<void> => {
                        const arrayId = value.split('.');
                        const rootId = arrayId.shift();
                        if (value && value !== column.id) {
                            if (arrayId.length > 0) {
                                // Persist changes for complex key
                                await view.diskConfig.updateColumnProperties(column.key, {
                                    id: rootId,
                                    nestedId: arrayId.join('.')
                                });
                            } else {
                                // Persist changes for simple key
                                await view.diskConfig.updateColumnProperties(column.key, {
                                    id: rootId,
                                    nestedId: ''
                                });
                            }
                            // Update state of altered column
                            columnsState.actions
                                .alterColumnId(column, rootId, arrayId)
                                .then(() => {
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
                                });
                            columnSettingsManager.modal.enableReset = true;
                        }
                    });
            });


        return this.goNext(response);
    }
}