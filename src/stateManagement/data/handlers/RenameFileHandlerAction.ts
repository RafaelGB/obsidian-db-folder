import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { PromptModal } from "components/modals/PromptModal";
import { MetadataColumns } from "helpers/Constants";
import { resolve_tfile } from "helpers/FileManagement";
import { Notice } from "obsidian";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RenameFileHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { set, get, implementation } = tableActionResponse;
        implementation.actions.renameFile = async (rowIndex: number) => {
            try {
                const rowToRename = get().rows[rowIndex];

                const oldFile = rowToRename[MetadataColumns.FILE].toString().split("|");
                const prompt_filename = new PromptModal(oldFile[0], "");

                const renameFilePromise = (newFilename: string) => {
                    const oldTfile = resolve_tfile(oldFile[1]);
                    const newPath = `${oldTfile.parent.path}/${newFilename}.md`;
                    app.vault.rename(oldTfile, newPath);
                    const newFile = `${newFilename}|${newPath}`;
                    rowToRename.__note__.filepath = newPath;
                    rowToRename[MetadataColumns.FILE] = newFile;
                    set((state) => {
                        return {
                            rows: [...state.rows.slice(0, rowIndex), rowToRename, ...state.rows.slice(rowIndex + 1)]
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