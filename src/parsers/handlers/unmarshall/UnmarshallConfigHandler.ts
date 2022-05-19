import { DiskHandlerResponse } from "cdm/MashallModel";
import { YAML_INDENT } from "helpers/Constants";
import { AbstractDiskHandler } from "parsers/handlers/unmarshall/AbstractDiskPropertyHandler";

export class UnmarshallConfigHandler extends AbstractDiskHandler {
    handlerName: string = 'config';

    public handle(handlerResponse: DiskHandlerResponse): DiskHandlerResponse {
        const { config } = handlerResponse.yaml;
        // Lvl1: config
        this.localDisk.push(`${this.handlerName}:`);
        Object.entries(config).forEach(([key, value]) => {
            if (typeof value === 'object') {
                this.localDisk.push(`${YAML_INDENT.repeat(1)}${key}:`);
                Object.entries(value).forEach(([key, value]) => {
                    // Lvl3: config properties
                    this.localDisk.push(`${YAML_INDENT.repeat(2)}${key}: ${value}`);
                });
            } else {
                // Lvl2: config properties
                this.localDisk.push(`${YAML_INDENT.repeat(1)}${key}: ${value}`);
            }
        });
        return this.goNext(handlerResponse);
    }
}
