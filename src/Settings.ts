import { App, ButtonComponent, PluginSettingTab, Setting } from "obsidian";
import { arraymove, get_tfiles_from_folder } from 'Utils';
import { log_error,errorWrapperSync, TemplaterError } from 'Base';
import DBFolderPlugin from 'main';
import { FolderSuggest } from 'suggesters/FolderSuggester';
import { FileSuggest, FileSuggestMode } from 'suggesters/FileSuggester';

export interface FolderTemplate {
    folder: string;
    template: string;
}

export interface Settings {
    folder_templates: Array<FolderTemplate>;
    enable_folder_templates: boolean;
    templates_folder: string;
}

export const DEFAULT_SETTINGS: Settings = {
    folder_templates: [{ folder: "", template: "" }],
    enable_folder_templates: true,
    templates_folder: "",
};

export class DBFolderSettingTab extends PluginSettingTab {

	constructor(public app: App, private plugin: DBFolderPlugin) {
        super(app, plugin);
    }

	display(): void {
		this.containerEl.empty();
		this.add_setting_header();
        this.add_folder_templates_setting();
	}
    /**
     * Add a header to the settings tab
     */
    add_setting_header(): void{
        let {containerEl} = this;
        containerEl.createEl('h2', {text: 'DBFolder Settings'});
    }

    add_folder_templates_setting(): void {
        this.containerEl.createEl("h2", { text: "Folder Templates" });

        const descHeading = document.createDocumentFragment();
        descHeading.append(
            "Folder Templates are triggered when a new ",
            descHeading.createEl("strong", { text: "empty " }),
            "file is created in a given folder.",
            descHeading.createEl("br"),
            "Templater will fill the empty file with the specified template.",
            descHeading.createEl("br"),
            "The deepest match is used. A global default template would be defined on the root ",
            descHeading.createEl("code", { text: "/" }),
            "."
        );

        new Setting(this.containerEl).setDesc(descHeading);

        const descUseNewFileTemplate = document.createDocumentFragment();
        descUseNewFileTemplate.append(
            "When enabled Templater will make use of the folder templates defined below."
        );

        new Setting(this.containerEl)
            .setName("Enable Folder Templates")
            .setDesc(descUseNewFileTemplate)
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.enable_folder_templates)
                    .onChange((use_new_file_templates) => {
                        this.plugin.settings.enable_folder_templates =
                            use_new_file_templates;
                        this.plugin.save_settings();
                        // Force refresh
                        this.display();
                    });
            });

        if (!this.plugin.settings.enable_folder_templates) {
            return;
        }

        new Setting(this.containerEl)
            .setName("Add New")
            .setDesc("Add new folder template")
            .addButton((button: ButtonComponent) => {
                button
                    .setTooltip("Add additional folder template")
                    .setButtonText("+")
                    .setCta()
                    .onClick(() => {
                        this.plugin.settings.folder_templates.push({
                            folder: "",
                            template: "",
                        });
                        this.plugin.save_settings();
                        this.display();
                    });
            });

        this.plugin.settings.folder_templates.forEach(
            (folder_template, index) => {
                const s = new Setting(this.containerEl)
                    .addSearch((cb) => {
                        new FolderSuggest(this.app, cb.inputEl);
                        cb.setPlaceholder("Folder")
                            .setValue(folder_template.folder)
                            .onChange((new_folder) => {
                                if (
                                    new_folder &&
                                    this.plugin.settings.folder_templates.some(
                                        (e) => e.folder == new_folder
                                    )
                                ) {
                                    log_error(
                                        new TemplaterError(
                                            "This folder already has a template associated with it"
                                        )
                                    );
                                    return;
                                }

                                this.plugin.settings.folder_templates[
                                    index
                                ].folder = new_folder;
                                this.plugin.save_settings();
                            });
                        // @ts-ignore
                        cb.containerEl.addClass("templater_search");
                    })
                    .addSearch((cb) => {
                        new FileSuggest(
                            this.app,
                            cb.inputEl,
                            this.plugin,
                            FileSuggestMode.TemplateFiles
                        );
                        cb.setPlaceholder("Template")
                            .setValue(folder_template.template)
                            .onChange((new_template) => {
                                this.plugin.settings.folder_templates[
                                    index
                                ].template = new_template;
                                this.plugin.save_settings();
                            });
                        // @ts-ignore
                        cb.containerEl.addClass("templater_search");
                    })
                    .addExtraButton((cb) => {
                        cb.setIcon("up-chevron-glyph")
                            .setTooltip("Move up")
                            .onClick(() => {
                                arraymove(
                                    this.plugin.settings.folder_templates,
                                    index,
                                    index - 1
                                );
                                this.plugin.save_settings();
                                this.display();
                            });
                    })
                    .addExtraButton((cb) => {
                        cb.setIcon("down-chevron-glyph")
                            .setTooltip("Move down")
                            .onClick(() => {
                                arraymove(
                                    this.plugin.settings.folder_templates,
                                    index,
                                    index + 1
                                );
                                this.plugin.save_settings();
                                this.display();
                            });
                    })
                    .addExtraButton((cb) => {
                        cb.setIcon("cross")
                            .setTooltip("Delete")
                            .onClick(() => {
                                this.plugin.settings.folder_templates.splice(
                                    index,
                                    1
                                );
                                this.plugin.save_settings();
                                this.display();
                            });
                    });
                s.infoEl.remove();
            }
        );
    }
}