import { DatabaseColumn, DatabaseYaml } from 'cdm/DatabaseModel';
import {
    Notice,
    TFile
} from 'obsidian';
import { LOGGER } from 'services/Logger';
import { VaultManagerDB } from 'services/FileManagerService';
import DatabaseYamlToStringParser from 'parsers/DatabaseYamlToStringParser';
import { ConfigColumn, NoteContentAction } from 'cdm/FolderModel';
import { FilterSettings, LocalSettings } from 'cdm/SettingsModel';
import { isDatabaseNote } from 'helpers/VaultManagement';
import DatabaseStringToYamlParser from 'parsers/DatabaseStringToYamlParser';
import { DATABASE_CONFIG } from 'helpers/Constants';

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
        LOGGER.info(`=>initDatabaseconfigYaml`, `file:${this.file.path}`);
        let databaseRaw = await VaultManagerDB.obtainContentFromTfile(this.file);
        if (!databaseRaw || !isDatabaseNote(databaseRaw)) throw new Error('No frontmatter found');
        // Temporal migration centinels code
        databaseRaw = databaseRaw.replaceAll(DATABASE_CONFIG.START_CENTINEL_LEGACY, DATABASE_CONFIG.START_CENTINEL);
        databaseRaw = databaseRaw.replaceAll(DATABASE_CONFIG.END_CENTINEL_LEGACY, DATABASE_CONFIG.END_CENTINEL);
        await app.vault.modify(this.file, databaseRaw);


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
        LOGGER.info(`<=initDatabaseconfigYaml`);
    }

    /**
     * Save database configuration on disk
     */
    async saveOnDisk(): Promise<void> {
        LOGGER.debug(`=>setDatabaseconfigYaml`, `file:${this.file.path}`);
        const databaseFilePath = this.file.path;
        const databaseConfigUpdated = DatabaseYamlToStringParser(this.yaml).join("\n");
        const noteObject: NoteContentAction = {
            action: 'replace',
            file: this.file,
            regexp: DATABASE_CONFIG.REPLACE_YAML_REGEX,
            newValue: `${DATABASE_CONFIG.START_CENTINEL}\n${databaseConfigUpdated}\n${DATABASE_CONFIG.END_CENTINEL}`
        };
        // Update configuration file
        await VaultManagerDB.editNoteContent(noteObject);
        LOGGER.debug(`<=setDatabaseconfigYaml`, `set file ${databaseFilePath} with ${databaseConfigUpdated}`);
    }

    /**
     * modify column key
     * @param oldColumnId 
     * @param newColumnId 
     */
    async updateColumnKey(oldColumnId: string, newColumnId: string, oldNestedIds?: string, nestedIds?: string): Promise<void> {
        // merge new column with new nested ids
        const id = `${newColumnId}${nestedIds ? `-${nestedIds}` : ''}`;
        // Obtain all columns with the same id
        const recordCols: Record<string, DatabaseColumn> = {};
        Object
            .entries(this.yaml.columns)
            .filter(([, value]) => value.id === oldColumnId)
            .forEach(([key, value]) => {
                recordCols[key] = value;
            });

        Object
            .entries(recordCols)
            .forEach(([key, value]) => {
                const currentCol = this.yaml.columns[key];
                const isCurrentOne = value.nestedKey === oldNestedIds;
                // update column id
                currentCol.id = newColumnId;
                currentCol.accessorKey = newColumnId;
                currentCol.key = newColumnId;
                delete this.yaml.columns[key];
                if (isCurrentOne) {
                    currentCol.nestedKey = isCurrentOne ? nestedIds : value.nestedKey;
                    this.yaml.columns[id] = currentCol;
                } else {
                    this.yaml.columns[`${newColumnId}-${value.nestedKey}`] = currentCol;
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