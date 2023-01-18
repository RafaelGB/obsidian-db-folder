import { DatabaseView } from "views/DatabaseView";
import { t } from "lang/helpers";
import { Setting } from "obsidian";
import { FolderSuggest } from "settings/suggesters/FolderSuggester";

export function destinationFolderSetting(view: DatabaseView, containerEl: HTMLElement) {
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