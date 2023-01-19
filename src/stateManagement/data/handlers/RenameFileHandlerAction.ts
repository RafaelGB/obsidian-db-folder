import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { TextModal } from "components/modals/TextModal";
import { Notice } from "obsidian";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RenameFileHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, set, get, implementation } = tableActionResponse;
        implementation.actions.renameFile = async (rowIndex: number) => {
            try {
                const rowToRename = get().rows[rowIndex];
                const prompt_filename = new TextModal(rowToRename.__note__.filepath, "").setPlaceholder("Type new filename here...");
                const renameFilePromise = async (newFilename: string) => {
                    const renamedRow = await view.dataApi.rename(rowToRename, newFilename);
                    set((state) => {
                        return {
                            rows: [...state.rows.slice(0, rowIndex), renamedRow, ...state.rows.slice(rowIndex + 1)]
                        }
                    });
                }
                await prompt_filename.openAndGetValue(renameFilePromise, () => { new Notice("Rename cancelled") });

            } catch (error) {
                new Notice(`Error: Could not remove note from database. ${error}`, 3000);
            }

        };
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);

    }
}