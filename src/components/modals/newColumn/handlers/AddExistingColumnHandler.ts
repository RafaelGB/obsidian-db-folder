import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { obtainColumnsFromRows } from "components/Columns";
import { DynamicInputType, MetadataColumns } from "helpers/Constants";
import { t } from "lang/helpers";
import { Notice, Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { StringSuggest } from "settings/suggesters/StringSuggester";

export class AddExistingColumnHandler extends AbstractHandlerClass<AddColumnModalHandlerResponse> {
    settingTitle: string = t("add_row_modal_add_existing_column_title");
    handle(response: AddColumnModalHandlerResponse): AddColumnModalHandlerResponse {
        const { containerEl, addColumnModalManager } = response;
        const { configState, columnState } = addColumnModalManager.props;
        const columns = columnState.info.getAllColumns();
        let selectedColumn: string = "";
        let typeOfNewColumn: string = "";
        const typesRecord: Record<string, string> = {};
        Object.values(DynamicInputType).forEach((value) => {
            typesRecord[value] = t(value);
        });

        const promiseOfObtainColumnsFromRows = new Promise<string[]>((resolve) => {
            resolve(obtainColumnsFromRows(
                addColumnModalManager.addColumnModal.view,
                configState.info.getLocalSettings(),
                configState.info.getFilters(),
                columns
            ));
        });
        const selectTypeHandler = (value: string): void => {
            typeOfNewColumn = value;
        }

        promiseOfObtainColumnsFromRows.then((columnsRaw: string[]) => {
            // Filter out the columns that are already in the table
            const currentColumns = (columnState.info.getValueOfAllColumnsAsociatedWith('id') as string[]).map(id => id.toLowerCase());
            const filteredColumns: Record<string, string> = {};
            columnsRaw
                .sort((a, b) => a.localeCompare(b))
                .filter((columnName: string) => {
                    return !currentColumns.includes(columnName.toLowerCase())
                }).forEach((columnName: string) => {
                    filteredColumns[columnName] = columnName;
                });
            new Setting(containerEl)
                .setName(this.settingTitle)
                .setDesc(t("add_row_modal_add_existing_column_desc"))
                .addSearch((cb) => {
                    new StringSuggest(
                        cb.inputEl,
                        filteredColumns
                    );
                    cb.setPlaceholder(t("add_row_modal_add_existing_column_placeholder"))
                        .setValue(selectedColumn)
                        .onChange((value: string) => {
                            selectedColumn = value;
                        });

                })
                .addDropdown((dropdown) => {
                    dropdown.addOptions(typesRecord);
                    dropdown.setValue(DynamicInputType.TEXT);
                    dropdown.onChange(selectTypeHandler);
                })
                .addExtraButton((cb) => {
                    cb.setIcon("create-new")
                        .setTooltip(t("add_row_modal_add_existing_column_button_tooltip"))
                        .onClick(async (): Promise<void> => {
                            if (!selectedColumn || filteredColumns[selectedColumn] === undefined) {
                                new Notice(t("add_row_modal_add_existing_notice_error_empty"), 1500);
                                return;
                            }
                            columnState.actions.addToLeft(
                                columns.find((o) => o.id === MetadataColumns.ADD_COLUMN),
                                selectedColumn,
                                typeOfNewColumn ? typeOfNewColumn : DynamicInputType.TEXT
                            );
                            addColumnModalManager.addColumnModal.enableReset = true;
                            // Refresh the modal to remove the selected column from the dropdown
                            addColumnModalManager.reset(response);
                            new Notice(t("add_row_modal_add_existing_notice_correct", selectedColumn), 1500);

                        });
                });
            this.goNext(response);
        });
        return null;
    }
}