import { DatabaseColumn, DatabaseYaml } from 'cdm/DatabaseModel';
import {
    Notice,
    TFile
} from 'obsidian';
import { LOGGER } from 'services/Logger';
import { VaultManagerDB } from 'services/FileManagerService';
import DatabaseYamlToStringParser from 'IO/md/DatabaseYamlToStringParser';
import { ConfigColumn, TableColumn } from 'cdm/FolderModel';
import { FilterSettings, LocalSettings } from 'cdm/SettingsModel';
import { isDatabaseNote } from 'helpers/VaultManagement';
import DatabaseStringToYamlParser from 'IO/md/DatabaseStringToYamlParser';
import { DATABASE_CONFIG } from 'helpers/Constants';
import NoteContentActionBuilder from 'patterns/builders/NoteContentActionBuilder';

export default class DatabaseInfo {
    private file: TFile;
    public yaml: DatabaseYaml;
    constructor(file: TFile) {
        this.file = file;
    }

    /**
     * Obtain database configuration from file
     * @param file 
     * @returns 
     */
    async initDatabaseconfigYaml(default_local_settings: LocalSettings): Promise<void> {
        LOGGER.info(`Load DDBB yaml - "${this.file.path}"`);
        const databaseRaw = await VaultManagerDB.obtainContentFromTfile(this.file);
        if (!databaseRaw || !isDatabaseNote(databaseRaw)) throw new Error('No frontmatter found');

        const match = databaseRaw.match(DATABASE_CONFIG.YAML);

        if (!match) {
            return null;
        }

        const frontmatterRaw = match[1];
        const response = DatabaseStringToYamlParser(frontmatterRaw);
        if (Object.keys(response.errors).length > 0) {
            const errors = Object.keys(response.errors).map(e => e + ': ' + response.errors[e].join('\n')).join('\n')
            new Notice(errors, 10000);
            if (!response.yaml.config) response.yaml.config = default_local_settings;
        }

        this.yaml = response.yaml;
    }

    /**
     * Save database configuration on disk
     */
    async saveOnDisk(): Promise<void> {
        LOGGER.info(`Update BBDD yaml - "${this.file.path}"`);
        const databaseConfigUpdated = DatabaseYamlToStringParser(this.yaml).join("\n");
        const noteObject = new NoteContentActionBuilder()
            .setFile(this.file)
            .addRegExp(DATABASE_CONFIG.REPLACE_YAML_REGEX)
            .addRegExpNewValue(`${DATABASE_CONFIG.START_CENTINEL}\n${databaseConfigUpdated}\n${DATABASE_CONFIG.END_CENTINEL}`)
            .build();
        // Update configuration file
        await VaultManagerDB.editNoteContent(noteObject);
    }

    /**
     * modify column key
     * @param oldColumnId 
     * @param newColumnId 
     */
    async updateColumnKey(currentCol: TableColumn, newColumnKey: string, newNestedKey: string[]): Promise<void> {
        Object
            .entries(this.yaml.columns)
            .forEach(([key, value]) => {
                // Check if column key is the same as the one we are updating 
                if (value.key === currentCol.key) {
                    // Check if we are updating the key
                    if (currentCol.key !== newColumnKey) {
                        delete this.yaml.columns[key];
                        value.key = newColumnKey;
                        value.accessorKey = newColumnKey;
                        // If the nested key is the same as the column key, we use the new column key
                        if (value.nestedKey === currentCol.nestedKey) {
                            value.nestedKey = newNestedKey.join('.');
                            this.yaml.columns[`${newColumnKey}${newNestedKey.length > 0 ? `-${newNestedKey}` : ''}`] = value;
                        } else {
                            this.yaml.columns[`${newColumnKey}${value.nestedKey ? `-${value.nestedKey}` : ''}`] = value;
                        }
                    }
                    // Check if we are updating the nested key without changing the column key
                    else if (value.nestedKey === currentCol.nestedKey) {
                        delete this.yaml.columns[key];
                        value.nestedKey = newNestedKey.join('.');
                        this.yaml.columns[`${value.key}${newNestedKey ? `-${newNestedKey.join("-")}` : ''}`] = value;
                    }
                }
            });

        // save on disk
        await this.saveOnDisk();
    }

    /**
     * Modify or add properties to a column
     * @param columnId 
     * @param properties 
     */
    async updateColumnProperties(columnId: string, properties: Partial<DatabaseColumn>): Promise<void> {
        const colToUpdate = this.yaml.columns[columnId];
        for (const key in properties) {
            colToUpdate[key] = properties[key];
        }
        this.yaml.columns[columnId] = colToUpdate;
        await this.saveOnDisk();
    }


    /**
     * Given an array of column ids, reorder yaml columns to match the order of the array
     * @param columnIds 
     */
    async reorderColumns(columnIds: string[]): Promise<void> {
        let id = 0;
        columnIds.forEach((columnId) => {
            // Filter out columns that are not in the list
            if (this.yaml.columns[columnId]) {
                this.yaml.columns[columnId].position = ++id;
            }
        });
        await this.saveOnDisk();
    }

    async removeColumn(columnId: string): Promise<void> {
        delete this.yaml.columns[columnId];
        await this.saveOnDisk();
    }

    addColumn(columnId: string, properties: DatabaseColumn) {
        this.yaml.columns[columnId] = properties;
        this.saveOnDisk();
    }

    async updateConfig(partialConfig: Partial<LocalSettings>): Promise<void> {
        this.yaml.config = {
            ...this.yaml.config,
            ...partialConfig
        };
        await this.saveOnDisk();
    }

    async updateColumnConfig(columnId: string, partialConfig: Partial<ConfigColumn>): Promise<void> {
        const colToUpdate = this.yaml.columns[columnId];
        colToUpdate.config = {
            ...colToUpdate.config,
            ...partialConfig
        };
        this.yaml.columns[columnId] = colToUpdate;
        await this.saveOnDisk();
    }

    async updateYaml<K extends keyof DatabaseYaml>(key: K, value: DatabaseYaml[K]): Promise<void> {
        this.yaml[key] = value;
        await this.saveOnDisk();
    }

    async updateFilters(partialFilters: Partial<FilterSettings>): Promise<void> {
        this.yaml.filters = {
            ...this.yaml.filters,
            ...partialFilters
        };
        await this.saveOnDisk();
    }
}