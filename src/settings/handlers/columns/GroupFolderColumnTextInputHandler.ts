import { InputType } from "helpers/Constants";
import { destination_folder } from "helpers/FileManagement";
import { FileGroupingService } from "services/FileGroupingService";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_toggle } from "settings/SettingsComponents";
import { FileGroupingColumnsSetting } from "./FileGroupingColumnsSetting";

const createDebouncer = ( callback: (...args: any[])=> void,
debounceDelay: number,) =>{
    const timeout: { current: ReturnType<typeof setTimeout>; } = { current: null };
    return {
      debounce: (
      ...args: any[]
      ) => {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(()=>callback(...args), debounceDelay);
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
        

            const  debouncedOrganizeNotesIntoSubfolders = createDebouncer(async ()=>{
              const folderPath = destination_folder(view, view.diskConfig.yaml.config);
              await FileGroupingService.organizeNotesIntoSubfolders( folderPath, view.rows, view.diskConfig.yaml.config );
              await FileGroupingService.removeEmptyFolders(folderPath, view.diskConfig.yaml.config);
            }, 5000);
              
            new FileGroupingColumnsSetting(view, allowedColumns,debouncedOrganizeNotesIntoSubfolders.debounce as any).init(containerEl);


           
            add_toggle(
              containerEl,
              "Group all files into folders automatically",
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

            add_toggle(
              containerEl,
              "Hoist files with missing attributes to root folder",
              "By default, files with missing attributes are hoisted to the lowest possible folder",
              view.diskConfig.yaml.config.hoist_files_with_empty_attributes,
              async (value) => {
                view.diskConfig.updateConfig({ hoist_files_with_empty_attributes: value});
              }
            )
    }
    return this.goNext(settingHandlerResponse);
  }
}
