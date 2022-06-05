import { CellSizeOptions } from "helpers/Constants";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_dropdown } from "settings/SettingsComponents";

export class CellSizeDropDownHandler extends AbstractSettingsHandler {
    settingTitle = 'Cell size';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, view } = settingHandlerResponse;
        const source_dropdown_promise = async (value: string): Promise<void> => {
            // update settings
            view.diskConfig.updateConfig('cell_size', value);
            // Force refresh of settings
            settingsManager.reset(settingHandlerResponse);
        };
        // render dropdown inside container
        add_dropdown(
            containerEl,
            this.settingTitle,
            'Choose how compact or wide cells are.',
            view.diskConfig.yaml.config.cell_size,
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