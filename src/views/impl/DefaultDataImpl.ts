import { DataApi } from "api/data-api";
import { RowDataType } from "cdm/FolderModel";

class DefaultDataImpl extends DataApi {
    create(entity: RowDataType): Promise<void> {
        throw new Error("Method not implemented.");
    }
    read(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    update(entity: RowDataType): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

export default DefaultDataImpl;