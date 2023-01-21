import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { UpdateRowInfo } from "cdm/TableStateInterface";
import { ValueOf } from "typings/base";
import { CustomView } from "views/AbstractView";
import { UpdateRowOptions } from "helpers/Constants";

export type UpdateApiInfo = Omit<UpdateRowInfo, "saveOnDisk"> & { action: ValueOf<typeof UpdateRowOptions> };
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
     * Update an entity
     * @param entity
     * @returns
     * @throws {Error} if the entity does not exist or the id is not valid
     */
    abstract update(updateRowInfo: UpdateApiInfo, modifiedRow: RowDataType): Promise<boolean>;

    /**
     * Delete an entity by id
     * @param id
     * @returns
     * @throws {Error} if the entity does not exist or the id is not valid or the entity cannot be deleted
     */
    abstract delete(rowToRemove: RowDataType): Promise<boolean>;

    /**
     * Rename an entity
     * @param rowToRename 
     * @param newName 
     */
    abstract rename(rowToRename: RowDataType, newName: string): Promise<RowDataType>;

    /**
     * Duplicate an entity
     * @param rowToDuplicate 
     */
    abstract duplicate(rowToDuplicate: RowDataType): Promise<boolean>;


}