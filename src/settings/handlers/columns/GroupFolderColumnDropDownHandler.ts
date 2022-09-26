import { InputType } from "helpers/Constants";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_text } from "settings/SettingsComponents";

export class GroupFolderColumnDropDownHandler extends AbstractSettingsHandler {
  settingTitle: string = 'Choose columns to organize files into subfolders'
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, local, view } = settingHandlerResponse;
        if (local) {
            const columns = view.diskConfig.yaml.columns;
            const allowedColumns = new Set(
                Object.keys(columns)
                .filter( (f) => columns[f].input === InputType.SELECT)
                .map((key) => columns[key].label),
            );

            const group_folder_column_input_promise =
                async (value: string): Promise<void> => {
                if (
                    value
                    .split(",")
                    .every((column) =>
                        allowedColumns.has(column),
                    )
                )
                    view.diskConfig.updateConfig({
                    group_folder_column: value,
                    });
                else
                    throw new Error(
                    value +
                        " is an invalid value for group_folder_column",
                    );
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
        }
        return this.goNext(settingHandlerResponse);
    }
}
