import { InputType } from "helpers/Constants";
import { destination_folder } from "helpers/FileManagement";
import { FileGroupingService } from "services/FileGroupingService";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_toggle } from "settings/SettingsComponents";
import { FileGroupingColumnsSetting } from "settings/handlers/columns/FileGroupingColumnsSetting";
import { t } from "lang/helpers";

export class GroupFolderColumnTextInputHandler extends AbstractSettingsHandler {
  settingTitle = t("settings_group_folder_column_title");
  handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
    const { containerEl, local, view, settingsManager } = settingHandlerResponse;
    if (local) {
      const columns = view.diskConfig.yaml.columns;
      const allowedColumns = new Set(
        Object.keys(columns)
          .filter((f) => columns[f].input === InputType.SELECT)
          .map((key) => columns[key].label),
      );

      settingsManager.cleanupFns.push(async () => {
        const config = view.diskConfig.yaml.config;
        if (config.automatically_group_files) {
          const folderPath = destination_folder(view, config);
          await FileGroupingService.organizeNotesIntoSubfolders(folderPath, view.rows, config);
          await FileGroupingService.removeEmptyFolders(folderPath, config);
          view.reloadDatabase();
        }
      });

      new FileGroupingColumnsSetting(view, allowedColumns).init(containerEl);

      add_toggle(
        containerEl,
        this.settingTitle,
        t("settings_group_folder_column_desc"),
        view.diskConfig.yaml.config.automatically_group_files,
        async (value) => {
          view.diskConfig.updateConfig({ automatically_group_files: value });
        }
      )
      add_toggle(
        containerEl,
        t("settings_group_folder_column_delete_toggle_title"),
        t("settings_group_folder_column_delete_toggle_desc"),
        view.diskConfig.yaml.config.remove_empty_folders,
        async (value) => {
          view.diskConfig.updateConfig({ remove_empty_folders: value });
        }
      )

      add_toggle(
        containerEl,
        t("settings_group_folder_column_hoist_toggle_title"),
        t("settings_group_folder_column_hoist_toggle_desc"),
        view.diskConfig.yaml.config.hoist_files_with_empty_attributes,
        async (value) => {
          view.diskConfig.updateConfig({ hoist_files_with_empty_attributes: value });
        }
      )
    }
    return this.goNext(settingHandlerResponse);
  }
}
