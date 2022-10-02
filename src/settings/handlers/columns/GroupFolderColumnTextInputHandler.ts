import { InputType } from "helpers/Constants";
import { destination_folder } from "helpers/FileManagement";
import { FileGroupingService } from "services/FileGroupingService";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_toggle } from "settings/SettingsComponents";
import { FileGroupingColumnsSetting } from "./FileGroupingColumnsSetting";

export class GroupFolderColumnTextInputHandler extends AbstractSettingsHandler {
  settingTitle: string = 'Define a schema to group files into folders';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, local, view,settingsManager } = settingHandlerResponse;
        if (local) {
            const columns = view.diskConfig.yaml.columns;
            const allowedColumns = new Set(
                Object.keys(columns)
                .filter( (f) => columns[f].input === InputType.SELECT)
                .map((key) => columns[key].label),
            );
        
              settingsManager.cleanupFns.push(async () => {
                const config = view.diskConfig.yaml.config;
                if (config.automatically_group_files) {
                  const folderPath = destination_folder(view, config);
                  await FileGroupingService.organizeNotesIntoSubfolders( folderPath, view.rows, config);
                  await FileGroupingService.removeEmptyFolders(folderPath, config);
                  view.reloadDatabase();
                }
              });
              
            new FileGroupingColumnsSetting(view, allowedColumns).init(containerEl);

            add_toggle(
              containerEl,
              "Group all files into folders automatically",
              "By default, files are groupped individually, after a value is updated",
              view.diskConfig.yaml.config.automatically_group_files,
              async (value) => {
                view.diskConfig.updateConfig({ automatically_group_files: value });
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
