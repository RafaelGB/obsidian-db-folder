import { LocalSettings } from "cdm/SettingsModel";
import { generateDbConfiguration, generateNewDatabase } from "helpers/CommandsHelper";
import { InputType, SourceDataTypes, StyleClasses } from "helpers/Constants";
import { resolve_tfolder } from "helpers/FileManagement";
import { generateDataviewTableQuery } from "helpers/QueryHelper";
import { Modal, Notice, Setting } from "obsidian";
import { DataviewService } from "services/DataviewService";
import { ParseService } from "services/ParseService";
import { add_dropdown, add_setting_header } from "settings/SettingsComponents";
import { FileSuggest } from "settings/suggesters/FileSuggester";
import { FolderSuggest } from "settings/suggesters/FolderSuggester";

export class DatabaseHelperCreationModal extends Modal {
    databaseHelperCreationModalManager: DatabaseHelperCreationModalManager;
    local_settings: LocalSettings;
    constructor(local_settings: LocalSettings) {
        super(app);
        this.local_settings = local_settings;
        this.databaseHelperCreationModalManager = new DatabaseHelperCreationModalManager(this);
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        this.databaseHelperCreationModalManager.constructUI(contentEl);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

export class DatabaseHelperCreationModalManager {
    databaseHelperCreationModal: DatabaseHelperCreationModal;
    destinationFolder = '/';
    databaseName = '';
    constructor(
        databaseHelperCreationModal: DatabaseHelperCreationModal,
    ) {
        this.databaseHelperCreationModal = databaseHelperCreationModal;


    }
    constructUI(containerEl: HTMLElement) {
        add_setting_header(containerEl, "Database creator helper", 'h2');
        const helperBody = containerEl.createDiv();
        helperBody.addClass(StyleClasses.SETTINGS_MODAL_BODY);
        helperBody.setAttribute("id", StyleClasses.SETTINGS_MODAL_BODY);
        this.constructSettingBody(helperBody);
    }

    constructSettingBody(bodyElement: HTMLElement) {
        new Setting(bodyElement)
            .setName("Database name")
            .setDesc("Name of the database to create")
            .addText(text => {
                text.setPlaceholder("Database name")
                    .setValue(this.databaseName)
                    .onChange(async (value: string): Promise<void> => {
                        this.databaseName = this.parseValueToThuthyYaml(value);
                    });
            });

        add_dropdown(
            bodyElement,
            'Select source',
            'Select from which source you want to create your custom database.',
            this.databaseHelperCreationModal.local_settings.source_data,
            {
                current_folder: SourceDataTypes.CURRENT_FOLDER,
                current_folder_without_subfolders: SourceDataTypes.CURRENT_FOLDER_WITHOUT_SUBFOLDERS,
                tag: SourceDataTypes.TAG,
                outgoing_link: SourceDataTypes.OUTGOING_LINK,
                incoming_link: SourceDataTypes.INCOMING_LINK,
                query: SourceDataTypes.QUERY,
            },
            async (value: string) => {
                this.databaseHelperCreationModal.local_settings.source_data = value;
                this.reset();
            }
        );
        switch (this.databaseHelperCreationModal.local_settings.source_data) {
            case SourceDataTypes.TAG:
                this.tagHandler(bodyElement);
                break;
            case SourceDataTypes.INCOMING_LINK:
            case SourceDataTypes.OUTGOING_LINK:
                this.outgoingAndIncomingHandler(bodyElement);
                break;
            case SourceDataTypes.QUERY:
                this.queryHandler(bodyElement);
                break;
            default:
            // do nothing
        }

        new Setting(bodyElement)
            .setName('Select where to save your database')
            .setDesc('Select the destination of where you want to save your database.')
            .addSearch((cb) => {
                new FolderSuggest(
                    cb.inputEl
                );
                cb.setPlaceholder("Example: path/to/folder")
                    .setValue(this.destinationFolder)
                    .onChange((value: string) => {
                        this.destinationFolder = value;
                    });
            });

        new Setting(bodyElement)
            .setName('Submit')
            .setDesc('Close to cancel or submit to create your database.')
            .addButton((cb) => {
                cb.setButtonText('Close')
                    .onClick(() => {
                        this.databaseHelperCreationModal.close();
                    });
            }).addButton((cb) => {
                cb.setButtonText('Create')
                    .onClick(async () => {
                        await this.createButtonHandler()
                    });
            });
    }

    reset() {
        const bodyElement = activeDocument.getElementById(StyleClasses.SETTINGS_MODAL_BODY);
        // remove all sections
        bodyElement.empty();
        this.constructSettingBody(bodyElement);
    }

    async createButtonHandler() {
        try {
            const targetFolder = resolve_tfolder(this.destinationFolder);
            this.databaseHelperCreationModal.local_settings.source_form_result = this.parseValueToThuthyYaml(
                this.databaseHelperCreationModal.local_settings.source_form_result
            );
            await generateNewDatabase(
                generateDbConfiguration(this.databaseHelperCreationModal.local_settings),
                targetFolder,
                this.databaseName
            );
            new Notice(`Database "${this.databaseName}" created in "${targetFolder.path}"`, 1500);
        } catch (e) {
            new Notice(`Error creating database "${this.databaseName}": ${e}`, 1500);
        }
        this.databaseHelperCreationModal.close();
    }

    tagHandler(containerEl: HTMLElement) {
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
                // update form result
                this.databaseHelperCreationModal.local_settings.source_form_result = value.slice(1);
            };

            add_dropdown(
                containerEl,
                'Select a tag',
                'Select tag to get data from',
                `#${this.databaseHelperCreationModal.local_settings.source_form_result}`,
                tagRecords,
                source_form_promise
            );
            this.destinationFolderHandler(containerEl);
        }
    }

    queryHandler(containerEl: HTMLElement) {
        const query_promise = async (value: string): Promise<void> => {
            // update settings
            this.databaseHelperCreationModal.local_settings.source_form_result = value;
        };
        new Setting(containerEl)
            .setName('Dataview query')
            .setDesc('Enter a dataview query starting with FROM (the plugin autocomplete the query with TABLE & the column fields)')
            .addTextArea((textArea) => {
                textArea.setValue(this.databaseHelperCreationModal.local_settings.source_form_result);
                textArea.setPlaceholder('Write here your dataview query...');
                textArea.onChange(query_promise);
            }).addExtraButton((cb) => {
                cb.setIcon("check")
                    .setTooltip("Validate query")
                    .onClick(async (): Promise<void> => {
                        const query = generateDataviewTableQuery(
                            [],
                            this.databaseHelperCreationModal.local_settings.source_form_result);
                        if (query) {
                            DataviewService.getDataviewAPI().tryQuery(query.replace('TABLE ,', 'TABLE '))
                                .then(() => {
                                    new Notice(`Dataview query "${query}" is valid!`, 2000);
                                })
                                .catch((e) => {
                                    new Notice(`Dataview query "${query}" is invalid: ${e.message}`, 10000);
                                });
                        }
                    });
            });
        this.destinationFolderHandler(containerEl);
    }

    outgoingAndIncomingHandler(containerEl: HTMLElement) {
        const source_form_promise = async (value: string): Promise<void> => {
            // update form result
            this.databaseHelperCreationModal.local_settings.source_form_result = value;
        };
        new Setting(containerEl)
            .setName('Select a file')
            .setDesc('Select file from vault to be used as source of data.')
            .addSearch((cb) => {
                new FileSuggest(
                    cb.inputEl,
                    "/"
                );
                cb.setPlaceholder("Example: folder1/template_file")
                    .setValue(this.databaseHelperCreationModal.local_settings.source_form_result)
                    .onChange(source_form_promise);
            });
        this.destinationFolderHandler(containerEl);
    }

    destinationFolderHandler(containerEl: HTMLElement) {
        const source_form_promise = async (value: string): Promise<void> => {
            // update settings
            this.databaseHelperCreationModal.local_settings.source_destination_path = value;
        };
        new Setting(containerEl)
            .setName('Select destination folder')
            .setDesc('Select the destination of new entries for this source')
            .addSearch((cb) => {
                new FolderSuggest(
                    cb.inputEl
                );
                cb.setPlaceholder("Example: path/to/folder")
                    .setValue(this.databaseHelperCreationModal.local_settings.source_destination_path)
                    .onChange(source_form_promise);
            });
    }

    parseValueToThuthyYaml(value: string): string {
        return ParseService.parseLiteral(
            value,
            InputType.MARKDOWN,
            this.databaseHelperCreationModal.local_settings
        ).toString();
    }
}