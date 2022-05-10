import { DiskHandlerResponse } from "cdm/MashallModel";
import { AbstractDiskHandler } from "parsers/handlers/unmarshall/AbstractDiskPropertyHandler";

export class UnmarshallDatabaseInfoHandler extends AbstractDiskHandler {
    handlerName: string = 'databaseInfo';

    public handle(handlerResponse: DiskHandlerResponse): DiskHandlerResponse {
        const { yaml } = handlerResponse;
        this.localDisk.push(`name: ${yaml.name}`);
        this.localDisk.push(`description: ${yaml.description}`);
        return this.goNext(handlerResponse);
    }
}