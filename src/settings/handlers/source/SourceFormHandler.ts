import { TableColumn } from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import { SourceDataTypes } from "helpers/Constants";
import { generateDataviewTableQuery } from "helpers/QueryHelper";
import { c } from "helpers/StylesHelper";
import { t } from "lang/helpers";
import { Notice, Setting } from "obsidian";
import { DataviewService } from "services/DataviewService";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { FileSuggest } from "settings/suggesters/FileSuggester";
import { destinationFolderSetting } from "./flavours/Helpers";
import { TagSourceBuilder } from "./flavours/TagsSourceBuilder";

export class SourceFormHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_source_form_title");
    private sourceFormResultTimeout: NodeJS.Timeout;
    tagsLabel: HTMLSpanElement;
    tagsContainer: HTMLParagraphElement;
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, view, columns } = settingHandlerResponse;
        switch (view.diskConfig.yaml.config.source_data) {
            case SourceDataTypes.TAG:
                new TagSourceBuilder(view, containerEl).build();
                break;
            case SourceDataTypes.OUTGOING_LINK:
            case SourceDataTypes.INCOMING_LINK:
                this.outgoingAndIncomingHandler(view, containerEl);
                break;
            case SourceDataTypes.QUERY:
                this.queryHandler(view, containerEl, columns);
                break;
            default:
            //Current folder
        }
        return this.goNext(settingHandlerResponse);
    }


    private outgoingAndIncomingHandler(view: DatabaseView, containerEl: HTMLElement) {
        const source_form_promise = async (value: string): Promise<void> => {
            // update settings
            view.diskConfig.updateConfig({ source_form_result: value });
        };
        new Setting(containerEl)
            .setName(t("settings_source_form_file_title"))
            .setDesc(t("settings_source_form_file_desc"))
            .addSearch((cb) => {
                new FileSuggest(
                    cb.inputEl,
                    view.file.parent.path
                );
                cb.setPlaceholder(t("settings_source_form_file_placeholder"))
                    .setValue(view.diskConfig.yaml.config.source_form_result)
                    .onChange(source_form_promise);
            });
        destinationFolderSetting(view, containerEl);
    }

    private queryHandler(view: DatabaseView, containerEl: HTMLElement, columns: TableColumn[]) {
        const query_promise = async (value: string): Promise<void> => {
            if (this.sourceFormResultTimeout) {
                clearTimeout(this.sourceFormResultTimeout);
            }
            this.sourceFormResultTimeout = setTimeout(() => {
                // update settings
                view.diskConfig.yaml.config.source_form_result = value;
                view.diskConfig.updateConfig({ source_form_result: value });
            }, 1500);

        };

        new Setting(containerEl)
            .setName(t("settings_source_form_query_title"))
            .setDesc(t("settings_source_form_query_desc"))
            .addTextArea((textArea) => {
                textArea.inputEl.addClass(c("textarea-setting"));
                textArea.setValue(view.diskConfig.yaml.config.source_form_result);
                textArea.setPlaceholder(t("settings_source_form_query_placeholder"));
                textArea.onChange(query_promise);
            }).addExtraButton((cb) => {
                cb.setIcon("check")
                    .setTooltip(t("settings_source_form_query_button_tooltip"))
                    .onClick(async (): Promise<void> => {
                        const query = generateDataviewTableQuery(
                            columns,
                            view.diskConfig.yaml.config.source_form_result);
                        if (query) {
                            DataviewService.getDataviewAPI().tryQuery(query)
                                .then(() => {
                                    new Notice(t("settings_source_form_query_notice_validate", query), 2000);
                                })
                                .catch((e) => {
                                    new Notice(t("settings_source_form_query_notice_error", query, e.message), 10000);
                                });
                        }
                    });
            });
        destinationFolderSetting(view, containerEl);
    }
}

