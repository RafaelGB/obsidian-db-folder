import { InputType } from "helpers/Constants";
import { Notice } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_text } from "settings/SettingsComponents";

const createNoticeDebouncer = () =>{
    const timeout: { current: ReturnType<typeof setTimeout>; } = { current: null };
    return {
      notice: (
        message: string,
        messageDelay: number,
        debounceDelay: number,
      ) => {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => { new Notice(message, messageDelay); }, debounceDelay);
      },
      cleanup: () => clearTimeout(timeout.current),
    };
} 


export class GroupFolderColumnTextInputHandler extends AbstractSettingsHandler {
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
            const lowerCaseAllowedColumns = new Set( Array.from(allowedColumns).map((f) => f.toLowerCase()),);
            const lowerCaseAllowedColumnsMap = new Map( Array.from(allowedColumns).map((key) => [key.toLowerCase(), key]),)
            const debouncedNotice = createNoticeDebouncer();
            const group_folder_column_input_promise =
              async ( value: string ): Promise<void> => {
                
                const validConfig =
                  value === "" ||
                  value
                    .split(",")
                    .every((column) => lowerCaseAllowedColumns.has( column.toLowerCase()));

                if (validConfig){
                    debouncedNotice.cleanup();
                    // make sure the case of each column is correct
                    const correctCaseColumns = value
                        .split(",")
                        .map((column) => lowerCaseAllowedColumnsMap.get(column.toLowerCase()))
                        .join(",");
                    view.diskConfig.updateConfig({ group_folder_column: correctCaseColumns });
                }
                else {
                    debouncedNotice.notice(`"${value}" is an invalid value for group_folder_column`, 1500, 1500)
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
        }
        return this.goNext(settingHandlerResponse);
    }
}
