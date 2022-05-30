import { DatabaseView } from "DatabaseView";
import { SourceDataTypes } from "helpers/Constants";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_dropdown } from "settings/SettingsComponents";

export class SourceFormHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Form in function of source data';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, view } = settingHandlerResponse;
        switch (view.diskConfig.yaml.config.source_data) {
            case SourceDataTypes.TAG:
                tagHandler(view, containerEl);
                break;
            case SourceDataTypes.OUTGOING_LINK:
            case SourceDataTypes.INCOMING_LINK:
                const filePaths: Record<string, string> = {}
                app.vault.getMarkdownFiles().forEach(file => { filePaths[file.path] = file.basename });
                const source_form_promise = async (value: string): Promise<void> => {
                    // update settings
                    view.diskConfig.updateConfig('source_form_result', value);
                };

                add_dropdown(
                    containerEl,
                    'Select a file',
                    'Select file from vault to be used as source of data.',
                    `${view.diskConfig.yaml.config.source_form_result}`,
                    filePaths,
                    source_form_promise
                );
                break;
            default:
            //Current folder
        }

        return this.goNext(settingHandlerResponse);
    }
}

function tagHandler(view: DatabaseView, containerEl: HTMLElement) {
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
}