import { DatabaseYaml } from "cdm/DatabaseModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { YamlHandlerResponse } from "cdm/MashallModel";
import { LocalSettings } from "cdm/SettingsModel";
import databaseStringToYamlParser from "IO/md/DatabaseStringToYamlParser";
import databaseYamlToStringParser from "IO/md/DatabaseYamlToStringParser";
import { CustomView } from "views/AbstractView";

/**
 * Abstract class that defines the CRUD API for a given entity.
 * Each entity will have a free format data structure, but it will be marshalled to a database standard format.
 */
export abstract class DataApi {
    constructor(protected view: CustomView) { }
    /**
     * Create a new entity
     * @param entity 
     */
    abstract create(filename: string, columns: TableColumn[], ddbbConfig: LocalSettings): Promise<RowDataType>;

    /**
     * Read an entity
     * @param id
     * @returns
     * @throws {Error} if the entity does not exist or the id is not valid
     */
    abstract read(id: string): Promise<RowDataType>;

    /**
     * Update an entity
     * @param entity
     * @returns
     * @throws {Error} if the entity does not exist or the id is not valid
     */
    abstract update(entity: RowDataType): Promise<boolean>;

    /**
     * Delete an entity by id
     * @param id
     * @returns
     * @throws {Error} if the entity does not exist or the id is not valid or the entity cannot be deleted
     */
    abstract delete(rowToRemove: RowDataType): Promise<boolean>;

    /**
     * Given a yaml, marshall it to the database standard format
     * @param yaml 
     * @returns 
     */
    marshallConfigYaml(yaml: string): YamlHandlerResponse {
        return databaseStringToYamlParser(yaml);
    }

    /**
     * Given a database standard format, unmarshall it to the yaml format
     * @param databaseFormat
     * @returns
     * @throws {Error} if the databaseFormat is not valid or the yaml cannot be generated
     */
    unmarshallConfigYaml(databaseFormat: DatabaseYaml): string {
        return databaseYamlToStringParser(databaseFormat);
    }
}