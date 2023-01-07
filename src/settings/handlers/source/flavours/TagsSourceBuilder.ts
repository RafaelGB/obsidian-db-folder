import { DatabaseView } from "DatabaseView";
import { t } from "lang/helpers";
import { Setting } from "obsidian";
import { StringSuggest } from "settings/suggesters/StringSuggester";
import { destinationFolderSetting } from "./Helpers";

export class TagSourceBuilder {
    settingTitle = t("settings_source_form_title");
    tagsLabel: HTMLSpanElement;
    tagsContainer: HTMLParagraphElement;
    tagRecords: Record<string, string> = {};
    selectedTags: string[] = [];

    constructor(private view: DatabaseView, private containerEl: HTMLElement) { }
    /**
     * TAGs custom settings
     * @param view 
     * @param containerEl 
     * @param columns 
     */
    public build() {
        this.initSuggestions();
        let suggester: StringSuggest;

        new Setting(this.containerEl)
            .setName(t("settings_source_form_tag_title"))
            .setDesc(t("settings_source_form_tag_desc"))
            .addSearch((cb) => {
                suggester = new StringSuggest(
                    cb.inputEl,
                    this.tagRecords
                );
                cb.setPlaceholder(t("settings_source_form_tag_placeholder"))
                    .onChange(async (value: string): Promise<void> => {
                        if (value && this.tagRecords[value]) {
                            // update settings
                            this.selectedTags.push(value);
                            suggester.removeSuggestion(value);
                            cb.setValue("");
                            cb.inputEl.blur();
                            await this.view.diskConfig.updateConfig(
                                { source_form_result: this.selectedTags.join(",") }
                            );
                            this.renderTags();
                        }
                    });

                cb.inputEl.style.width = "auto";
            }).addButton((button) => {
                button.setButtonText("Reset")
                    .setTooltip(t("settings_source_form_tag_clear_button_tooltip"))
                    .onClick(async () => {
                        // Clear all tags
                        this.selectedTags = [];
                        suggester.setSuggestions(this.tagRecords);
                        await this.view.diskConfig.updateConfig({
                            source_form_result: ""
                        });
                        this.initSuggestions();
                        this.tagsLabel.innerHTML = "None";
                        this.tagsContainer.style.display = "none";
                    });
            });
        this.configureTagDisplay();
        destinationFolderSetting(this.view, this.containerEl);
    }

    private configureTagDisplay = () => {
        this.tagsContainer = this.containerEl.createEl("div");
        const label = this.containerEl.createEl("span", {
            text: t("settings_source_form_tag_selected"),
        });
        label.style.color = "#666";
        this.tagsContainer.appendChild(label);

        this.tagsLabel = this.containerEl.createEl("span");
        this.tagsContainer.appendChild(this.tagsLabel);
        this.tagsContainer.style.gap = "15px";
        this.tagsContainer.style.marginBottom = "20px";
        this.renderTags();
    };

    private renderTags = () => {
        if (this.selectedTags.length) {
            this.tagsLabel.innerHTML =
                this.selectedTags
                    .map((v) => `<span style='color: #999;'>${v}</span>`)
                    .join("<span style='color: #666;'> OR </span>") || "None";
            this.tagsContainer.style.display = "flex";
        } else {
            this.tagsContainer.style.display = "none";
        }
    };

    private initSuggestions = () => {
        const tagArray: Record<string, number> = app.metadataCache.getTags();
        const source_form_result = this.view.diskConfig.yaml.config.source_form_result;
        this.selectedTags = source_form_result ? source_form_result.split(",") : [];

        // Order tagRecord by key (tag name)
        Object.entries(tagArray)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .filter(([key,]) => !this.selectedTags.contains(key))
            .forEach(([key, value]) => {
                this.tagRecords[key] = `${key}(${value})`;
            });
    }
}

