import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { PromptModal } from "components/modals/PromptModal";
import { MetadataColumns } from "helpers/Constants";
import { resolve_tfile } from "helpers/FileManagement";
import { Notice } from "obsidian";
import { Link } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RenameFileHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { set, get, implementation } = tableActionResponse;
        implementation.actions.renameFile = async (rowIndex: number) => {
            try {
                const rowToRename = get().rows[rowIndex];
                const fileLink = rowToRename[MetadataColumns.FILE] as Link;
                const oldFile = fileLink.fileName();
                const prompt_filename = new PromptModal(oldFile, "");

                const renameFilePromise = (newFilename: string) => {
                    const oldTfile = resolve_tfile(fileLink.path);
                    const newPath = `${oldTfile.parent.path}/${newFilename}.md`;
                    app.vault.rename(oldTfile, newPath);
                    rowToRename.__note__.filepath = newPath;
                    rowToRename[MetadataColumns.FILE] = DataviewService.getDataviewAPI().fileLink(newPath);
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