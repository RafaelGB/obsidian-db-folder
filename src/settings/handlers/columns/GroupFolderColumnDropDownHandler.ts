import { Filter } from "@material-ui/icons";
import { DataTypes } from "helpers/Constants";
import { LOGGER } from "services/Logger";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_dropdown } from "settings/SettingsComponents";

export class GroupFolderColumnDropDownHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Choose column for group folder';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, local, view } = settingHandlerResponse;
        if (local) {
            const columns = view.diskConfig.yaml.columns;
            const current_group_folder = view.diskConfig.yaml.config.group_folder_column;
            const options: Record<string, string> = { none: '' };
            Object.keys(columns)
                .filter(f => columns[f].input === DataTypes.SELECT)
                .forEach(key => {
                    options[key] = columns[key].label;
                });
            const group_folder_column_dropdown_promise = async (value: string): Promise<void> => {
                view.diskConfig.updateConfig('group_folder_column', value);
            }

            add_dropdown(
                containerEl,
                this.settingTitle,
                'This setting assigns the column that will be used to group the files into subfolders',
                current_group_folder,
                options,
                group_folder_column_dropdown_promise
            );
        }
        return this.goNext(settingHandlerResponse);
    }
}