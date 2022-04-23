import { DatabaseColumn, DatabaseYaml } from 'cdm/DatabaseModel';
import {
    parseYaml,
    TFile
} from 'obsidian';
import { LOGGER } from 'services/Logger';
import { VaultManagerDB } from 'services/FileManagerService';
import { convertDatabaseYamlToParsedString, hasFrontmatterKey } from 'parsers/DatabaseParser';
import { NoteContentAction } from 'cdm/FolderModel';
import { LocalSettings } from 'Settings';

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
    async initDatabaseconfigYaml(default_local_settings:LocalSettings):Promise<void> {
        LOGGER.info(`=>initDatabaseconfigYaml`,`file:${this.file.path}`);
        const databaseRaw = await VaultManagerDB.obtainContentFromTfile(this.file);
        if (!databaseRaw || !hasFrontmatterKey(databaseRaw))  throw new Error('No frontmatter found');

        const match = databaseRaw.match(/<%%\s+([\w\W]+?)\s+%%>/);

        if (!match) {
            return null;
        }
        const frontmatterRaw = match[1];
        this.yaml = parseYaml(frontmatterRaw);
        // Add default config in case of does not exist on file yet
        if(!this.yaml.config) this.yaml.config = default_local_settings;
        LOGGER.info(`<=initDatabaseconfigYaml`);
    }
    /**
     * Save database configuration on disk
     */
    async saveOnDisk():Promise<void> {
        LOGGER.debug(`=>setDatabaseconfigYaml`,`file:${this.file.path}`);
        const configRegex = new RegExp(`<%%\\s+([\\w\\W]+?)\\s+%%>`,"g");
        const databaseFilePath = this.file.path;
        const databaseConfigUpdated = convertDatabaseYamlToParsedString(this.yaml).join("\n");
        const noteObject:NoteContentAction = {
            action: 'replace',
            file: this.file,
            regexp: configRegex,
            newValue: `<%%\n${databaseConfigUpdated}\n%%>`
        };
        // Update configuration file
        await VaultManagerDB.editNoteContent(noteObject);
        LOGGER.debug(`<=setDatabaseconfigYaml`,`set file ${databaseFilePath} with ${databaseConfigUpdated}`);
    }
    
    /**
     * modify column key
     * @param oldColumnId 
     * @param newColumnId 
     */
    async updateColumnKey(oldColumnId:string, newColumnId:string):Promise<void>{
        // clone current column configuration
        const currentCol = this.yaml.columns[oldColumnId];
        // update column id
        currentCol.label = newColumnId;
        currentCol.accessor = newColumnId;
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
    async updateColumnProperties<P extends keyof DatabaseColumn>(columnId:string, properties:Record<string,P>):Promise<void>{
        const currentCol = this.yaml.columns[columnId];
        for (const key in properties) {
            currentCol[key] = properties[key];
        }
        this.yaml.columns[columnId] = currentCol;
        await this.saveOnDisk();
    }
    
    /**
     * Given an array of column ids, reorder yaml columns to match the order of the array
     * @param columnIds 
     */
    async reorderColumns(columnIds:string[]):Promise<void>{
        let id = 0;
        columnIds.forEach((columnId) => {
            // Filter out columns that are not in the list
            if(this.yaml.columns[columnId]){
                this.yaml.columns[columnId].position = ++id;
            }
        });
        await this.saveOnDisk();
    }

    async removeColumn(columnId:string):Promise<void>{
        delete this.yaml.columns[columnId];
        await this.saveOnDisk();
    }

    async addColumn(columnId:string, properties:DatabaseColumn):Promise<void>{
        this.yaml.columns[columnId] = properties;
        await this.saveOnDisk();
    }

    async updateConfig<K extends keyof LocalSettings>(key: K, value: LocalSettings[K]): Promise<void> {
        this.yaml.config[key] = value;
        await this.saveOnDisk();
      }
}