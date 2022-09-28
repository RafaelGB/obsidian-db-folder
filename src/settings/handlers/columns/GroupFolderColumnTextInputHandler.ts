import { InputType } from "helpers/Constants";
import { destination_folder } from "helpers/FileManagement";
import { removeEmptyFolders } from "helpers/RemoveEmptyFolders";
import { organizeNotesIntoSubfolders } from "helpers/VaultManagement";
import { Notice } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_text, add_toggle } from "settings/SettingsComponents";

const createDebouncer = ( callback: (...args: any[])=> void,
debounceDelay: number,) =>{
    const timeout: { current: ReturnType<typeof setTimeout>; } = { current: null };
    return {
      debounce: (
      ...args: any[]
      ) => {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(()=>callback(args), debounceDelay);
      },
      cleanup: () => clearTimeout(timeout.current),
    };
} 


export class GroupFolderColumnTextInputHandler extends AbstractSettingsHandler {
  settingTitle: string = 'Define a schema to group files into folders';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, local, view } = settingHandlerResponse;
        if (local) {
            const columns = view.diskConfig.yaml.columns;
            const allowedColumns = new Set(
                Object.keys(columns)
                .filter( (f) => columns[f].input === InputType.SELECT)
                .map((key) => columns[key].label),
            );
            const lowerCaseAllowedColumns = new Set( Array.from(allowedColumns).map((f) => f.toLowerCase()),);
            const lowerCaseAllowedColumnsMap = new Map( Array.from(allowedColumns).map((key) => [key.toLowerCase(), key]),)
            const debouncedNotice = createDebouncer((message, messageDelay)=>new Notice(message, messageDelay), 1500);
            const debouncedOrganizeNotesIntoSubfolders = createDebouncer(async ()=>{
              const folderPath = destination_folder(view, view.diskConfig.yaml.config);
              await organizeNotesIntoSubfolders( folderPath, view.rows, view.diskConfig.yaml.config );
              await removeEmptyFolders(folderPath, view.diskConfig.yaml.config);
            }, 5000);
            const group_folder_column_input_promise =
              async ( value: string ): Promise<void> => {

                const validConfig =
                  value === "" ||
                  value
                    .split(",")
                    .every((column) => lowerCaseAllowedColumns.has( column.toLowerCase()));

                if (validConfig){
                    debouncedNotice.cleanup();
                    debouncedOrganizeNotesIntoSubfolders.cleanup();
                    // make sure the case of each column is correct
                    const correctCaseColumns = value
                        .split(",")
                        .map((column) => lowerCaseAllowedColumnsMap.get(column.toLowerCase()))
                        .join(",");
                    view.diskConfig.updateConfig({ group_folder_column: correctCaseColumns });
                    debouncedOrganizeNotesIntoSubfolders.debounce();
                }
                else {
                    debouncedNotice.debounce(`"${value}" is an invalid value for group_folder_column`, 4000)
                }
              };

            add_text(
                containerEl,
                this.settingTitle,
                "Multiple columns can be used, separated by a comma. Available columns: " +
                [...allowedColumns].join(", "),
                "Comma separated column names",
                view.diskConfig.yaml.config
                .group_folder_column,
                group_folder_column_input_promise,
            );
           
            add_toggle(
              containerEl,
              "Automatically group all files into folders",
              "By default, files are groupped individually, after a value is updated",
              view.diskConfig.yaml.config.automatically_group_files,
              async (value) => {
                view.diskConfig.updateConfig({ automatically_group_files: value });
                if(value){
                    debouncedOrganizeNotesIntoSubfolders.debounce();
                }
              }
            )
            add_toggle(
              containerEl,
              "Remove empty folders",
              "Automatically remove empty folders after grouping files.",
              view.diskConfig.yaml.config.remove_empty_folders,
              async (value) => {
                view.diskConfig.updateConfig({ remove_empty_folders: value });
              }
            )
    }
    return this.goNext(settingHandlerResponse);
  }
}
