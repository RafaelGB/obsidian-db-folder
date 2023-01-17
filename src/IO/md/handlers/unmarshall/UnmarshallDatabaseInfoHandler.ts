import { DiskHandlerResponse } from "cdm/MashallModel";
import { AbstractDiskHandler } from "IO/md/handlers/unmarshall/AbstractDiskPropertyHandler";

export class UnmarshallDatabaseInfoHandler extends AbstractDiskHandler {
    handlerName = 'databaseInfo';

    public handle(handlerResponse: DiskHandlerResponse): DiskHandlerResponse {
        const { yaml } = handlerResponse;
        this.localDisk.push(`name: ${yaml.name}`);
        this.localDisk.push(`description: ${yaml.description}`);
        return this.goNext(handlerResponse);
    }
}