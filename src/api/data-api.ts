import { DatabaseYaml } from "cdm/DatabaseModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { YamlHandlerResponse } from "cdm/MashallModel";
import databaseStringToYamlParser from "IO/md/DatabaseStringToYamlParser";
import databaseYamlToStringParser from "IO/md/DatabaseYamlToStringParser";

/**
 * Abstract class that defines the CRUD API for a given entity.
 * Each entity will have a free format data structure, but it will be marshalled to a database standard format.
 */
export abstract class DataApi {
    /**
     * Create a new entity
     * @param entity 
     */
    abstract create(entity: RowDataType): Promise<void>;

    /**
     * Read an entity
     * @param id
     * @returns
     * @throws {Error} if the entity does not exist or the id is not valid
     */
    abstract read(id: string): Promise<boolean>;

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
    abstract delete(id: string): Promise<boolean>;

    /**
     * Get all the entities in the database
     */
    abstract getRows(): Promise<RowDataType[]>;

    /**
     * Get all the columns configured in the database
     */
    abstract getColumns(): Promise<TableColumn[]>;

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