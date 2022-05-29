import { SourceDataTypes } from "helpers/Constants";
import { getAllTags } from "obsidian";
import { DataviewService } from "services/DataviewService";
import { LOGGER } from "services/Logger";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_dropdown } from "settings/SettingsComponents";

export class SourceFormHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Form in function of source data';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, view } = settingHandlerResponse;
        switch (view.diskConfig.yaml.config.source_data) {
            case SourceDataTypes.TAG:
                const tagArray: Record<string, number> = (app.metadataCache as unknown as any).getTags();
                if (tagArray) {
                    const tagRecords: Record<string, string> = {};
                    Object.keys(tagArray).forEach((tag) => {
                        tagRecords[tag] = tag;
                    });
                    const source_form_promise = async (value: string): Promise<void> => {
                        // update settings
                        view.diskConfig.updateConfig('source_form_result', value.slice(1));
                    };

                    add_dropdown(
                        containerEl,
                        'Select a tag',
                        'Select tag to get data from',
                        `#${view.diskConfig.yaml.config.source_form_result}`,
                        tagRecords,
                        source_form_promise
                    );
                }
            default:
            //Current folder
        }

        return this.goNext(settingHandlerResponse);
    }
}