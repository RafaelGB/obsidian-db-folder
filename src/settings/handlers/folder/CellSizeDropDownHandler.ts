import { CellSizeOptions } from "helpers/Constants";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_dropdown } from "settings/SettingsComponents";

export class CellSizeDropDownHandler extends AbstractSettingsHandler {
    settingTitle = 'Cell size';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, view, local, settingsManager } = settingHandlerResponse;
        const source_dropdown_promise = async (value: string): Promise<void> => {
            if (local) {
                // update settings
                view.diskConfig.updateConfig({ cell_size: value });
            } else {
                // switch show created on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.cell_size = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        };
        const current_cell_size = local ?
            view.diskConfig.yaml.config.cell_size :
            settingsManager.plugin.settings.local_settings.cell_size;
        // render dropdown inside container
        add_dropdown(
            containerEl,
            this.settingTitle,
            'Choose how compact or wide cells are.',
            current_cell_size,
            {
                compact: CellSizeOptions.COMPACT,
                normal: CellSizeOptions.NORMAL,
                wide: CellSizeOptions.WIDE
            },
            source_dropdown_promise
        );
        return this.goNext(settingHandlerResponse);
    }
}
