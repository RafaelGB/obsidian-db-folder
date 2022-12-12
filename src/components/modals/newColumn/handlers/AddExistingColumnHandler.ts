import { DatabaseColumn } from "cdm/DatabaseModel";
import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { obtainColumnsFromRows } from "components/Columns";
import { DynamicInputType, MetadataColumns } from "helpers/Constants";
import { t } from "lang/helpers";
import { Notice, Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { StringSuggest } from "settings/suggesters/StringSuggester";

export class AddExistingColumnHandler extends AbstractHandlerClass<AddColumnModalHandlerResponse> {
    settingTitle: string = 'Add existing column';
    handle(response: AddColumnModalHandlerResponse): AddColumnModalHandlerResponse {
        const { containerEl, addColumnModalManager } = response;
        const { configState, columnState } = addColumnModalManager.props;
        const columns = columnState.info.getAllColumns();
        let selectedColumn: string = "";
        let typeOfNewColumn: string = DynamicInputType.TEXT;
        const typesRecord: Record<string, string> = {};
        Object.values(DynamicInputType).forEach((value) => {
            typesRecord[value] = t(value);
        });

        const promiseOfObtainColumnsFromRows = new Promise<Record<string, DatabaseColumn>>((resolve) => {
            resolve(obtainColumnsFromRows(
                addColumnModalManager.addColumnModal.view,
                configState.info.getLocalSettings(),
                configState.info.getFilters(),
                columns
            ));
        });
        const selectTypeHandler = (value: string): void => {
            if (!value) return;
            typeOfNewColumn = value;
        }

        promiseOfObtainColumnsFromRows.then((columnsRaw: Record<string, DatabaseColumn>) => {
            // Filter out the columns that are already in the table
            const currentColumns = (columnState.info.getValueOfAllColumnsAsociatedWith('id') as string[]).map(id => id);
            const filteredColumns: Record<string, string> = {};
            Object.keys(columnsRaw)
                .sort((a, b) => a.localeCompare(b))
                .filter((columnName: string) => {
                    return !currentColumns.includes(columnName.toLowerCase())
                }).forEach((columnName: string) => {
                    filteredColumns[columnName] = columnName;
                });
            new Setting(containerEl)
                .setName('Select an existing column to add')
                .setDesc('Select an existing column to add not included yet in the table')
                .addSearch((cb) => {
                    new StringSuggest(
                        cb.inputEl,
                        filteredColumns
                    );
                    cb.setPlaceholder("Search column...")
                        .setValue(selectedColumn)
                        .onChange((value: string) => {
                            selectedColumn = value;
                        });

                })
                .addSearch(cb => {
                    new StringSuggest(
                        cb.inputEl,
                        typesRecord
                    );
                    cb.setPlaceholder("Select type...")
                        .setValue(DynamicInputType.TEXT)
                        .onChange(selectTypeHandler);
                })
                .addExtraButton((cb) => {
                    cb.setIcon("create-new")
                        .setTooltip("Create the selected column and refresh the table")
                        .onClick(async (): Promise<void> => {
                            if (!selectedColumn || filteredColumns[selectedColumn] === undefined) {
                                new Notice("You need to select a column to add", 1500);
                                return;
                            }
                            columnState.actions.addToLeft(columns.find((o) => o.id === MetadataColumns.ADD_COLUMN), selectedColumn, typeOfNewColumn);
                            addColumnModalManager.addColumnModal.enableReset = true;
                            // Refresh the modal to remove the selected column from the dropdown
                            addColumnModalManager.reset(response);
                            new Notice(`"${selectedColumn}" added to the table`, 1500);

                        });
                });
            this.goNext(response);
        });
        return null;
    }
}