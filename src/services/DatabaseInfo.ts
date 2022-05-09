import { DatabaseColumn, DatabaseYaml, FilterCondition } from 'cdm/DatabaseModel';
import {
    Notice,
    TFile
} from 'obsidian';
import { LOGGER } from 'services/Logger';
import { VaultManagerDB } from 'services/FileManagerService';
import DatabaseYamlToStringParser from 'parsers/DatabaseYamlToStringParser';
import { NoteContentAction } from 'cdm/FolderModel';
import { LocalSettings } from 'Settings';
import { isDatabaseNote } from 'helpers/VaultManagement';
import DatabaseStringToYamlParser from 'parsers/DatabaseStringToYamlParser';

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
        const databaseRaw = await VaultManagerDB.obtainContentFromTfile(this.file);
        if (!databaseRaw || !isDatabaseNote(databaseRaw)) throw new Error('No frontmatter found');

        const match = databaseRaw.match(/<%%\s+([\w\W]+?)\s+%%>/);

        if (!match) {
            return null;
        }

        const frontmatterRaw = match[1];
        const response = DatabaseStringToYamlParser(frontmatterRaw);
        if (Object.keys(response.errors).length > 0) {
            const errors = Object.keys(response.errors).map(e => e + ': ' + response.errors[e].join('\n')).join('\n')
            new Notice(errors);
            if (!response.yaml.config) response.yaml.config = default_local_settings;
        }

        this.yaml = response.yaml;
        await this.saveOnDisk();
        LOGGER.info(`<=initDatabaseconfigYaml`);
    }

    /**
     * Save database configuration on disk
     */
    async saveOnDisk(): Promise<void> {
        LOGGER.debug(`=>setDatabaseconfigYaml`, `file:${this.file.path}`);
        const configRegex = new RegExp(`<%%\\s+([\\w\\W]+?)\\s+%%>`, "g");
        const databaseFilePath = this.file.path;
        const databaseConfigUpdated = DatabaseYamlToStringParser(this.yaml).join("\n");
        const noteObject: NoteContentAction = {
            action: 'replace',
            file: this.file,
            regexp: configRegex,
            newValue: `<%%\n${databaseConfigUpdated}\n%%>`
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
    async updateColumnKey(oldColumnId: string, newColumnId: string, newLabel: string): Promise<void> {
        // clone current column configuration
        const currentCol = this.yaml.columns[oldColumnId];
        // update column id
        currentCol.label = newColumnId;
        currentCol.accessor = newColumnId;
        currentCol.key = newColumnId;
        delete this.yaml.columns[oldColumnId];
        this.yaml.columns[newColumnId] = currentCol;
        // save on disk
        await this.saveOnDisk();
    }

    /**
     * Modify or add properties to a column
     * @param columnId 
     * @param properties 
     */
    async updateColumnProperties<P extends keyof DatabaseColumn>(columnId: string, properties: Record<string, P>): Promise<void> {
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

    async addColumn(columnId: string, properties: DatabaseColumn): Promise<void> {
        this.yaml.columns[columnId] = properties;
        await this.saveOnDisk();
    }

    async updateConfig<K extends keyof LocalSettings>(key: K, value: LocalSettings[K]): Promise<void> {
        this.yaml.config[key] = value;
        await this.saveOnDisk();
    }

    async updateYaml<K extends keyof DatabaseYaml>(key: K, value: DatabaseYaml[K]): Promise<void> {
        this.yaml[key] = value;
        await this.saveOnDisk();
    }

    async updateFilters(updatedFilters: FilterCondition[]): Promise<void> {
        this.yaml.filters = updatedFilters;
        await this.saveOnDisk();
    }
}