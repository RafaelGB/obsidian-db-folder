import { TableColumn } from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import { SourceDataTypes } from "helpers/Constants";
import { generateDataviewTableQuery } from "helpers/QueryHelper";
import { t } from "lang/helpers";
import { Notice, Setting } from "obsidian";
import { DataviewService } from "services/DataviewService";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { FileSuggest } from "settings/suggesters/FileSuggester";
import { FolderSuggest } from "settings/suggesters/FolderSuggester";
import { StringSuggest } from "settings/suggesters/StringSuggester";

export class SourceFormHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_source_form_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, view, columns } = settingHandlerResponse;
        switch (view.diskConfig.yaml.config.source_data) {
            case SourceDataTypes.TAG:
                this.tagHandler(view, containerEl);
                break;
            case SourceDataTypes.OUTGOING_LINK:
            case SourceDataTypes.INCOMING_LINK:
                this.outgoingAndIncomingHandler(view, containerEl);
                break;
            case SourceDataTypes.QUERY:
                this.queryHandler(view, containerEl, columns);
            default:
            //Current folder
        }

        return this.goNext(settingHandlerResponse);
    }

    private tagHandler(view: DatabaseView, containerEl: HTMLElement) {
        const tagArray: Record<string, number> = (app.metadataCache as unknown as any).getTags();
        if (tagArray) {
            const tagRecords: Record<string, string> = {};
            // Order tagRecord by key (tag name)
            Object.entries(tagArray)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .forEach(([key, value]) => {
                    tagRecords[key] = `${key}(${value})`;
                });
            const source_form_promise = async (value: string): Promise<void> => {
                // update settings
                view.diskConfig.updateConfig({ source_form_result: value.slice(1) });
            };
            new Setting(containerEl)
                .setName(t("settings_source_form_tag_title"))
                .setDesc(t("settings_source_form_tag_desc"))
                .addSearch((cb) => {
                    new StringSuggest(
                        cb.inputEl,
                        tagRecords
                    );
                    cb.setPlaceholder(t("settings_source_form_tag_placeholder"))
                        .setValue(`#${view.diskConfig.yaml.config.source_form_result}`)
                        .onChange(source_form_promise);
                });
            this.destinationFolderHandler(view, containerEl);
        }
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
        this.destinationFolderHandler(view, containerEl);
    }

    private queryHandler(view: DatabaseView, containerEl: HTMLElement, columns: TableColumn[]) {
        const query_promise = async (value: string): Promise<void> => {
            // update settings
            view.diskConfig.yaml.config.source_form_result = value;
            view.diskConfig.updateConfig({ source_form_result: value });
        };
        new Setting(containerEl)
            .setName(t("settings_source_form_query_title"))
            .setDesc(t("settings_source_form_query_desc"))
            .addTextArea((textArea) => {
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
        this.destinationFolderHandler(view, containerEl);
    }

    private destinationFolderHandler(view: DatabaseView, containerEl: HTMLElement) {
        const source_form_promise = async (value: string): Promise<void> => {
            // update settings
            view.diskConfig.updateConfig({ source_destination_path: value });
        };
        new Setting(containerEl)
            .setName(t("settings_source_form_destination_title"))
            .setDesc(t("settings_source_form_destination_desc"))
            .addSearch((cb) => {
                new FolderSuggest(
                    cb.inputEl
                );
                cb.setPlaceholder(t("settings_source_form_destination_placeholder"))
                    .setValue(view.diskConfig.yaml.config.source_destination_path)
                    .onChange(source_form_promise);
            });
    }
}

