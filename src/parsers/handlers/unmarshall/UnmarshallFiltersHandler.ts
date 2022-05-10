import { DiskHandlerResponse } from "cdm/MashallModel";
import { YAML_INDENT } from "helpers/Constants";
import { AbstractDiskHandler } from "parsers/handlers/unmarshall/AbstractDiskPropertyHandler";

export class UnmarshallFiltersHandler extends AbstractDiskHandler {
    handlerName: string = 'filters';

    public handle(handlerResponse: DiskHandlerResponse): DiskHandlerResponse {
        const { filters } = handlerResponse.yaml;
        // Lvl1: filters
        this.localDisk.push(`${this.handlerName}:`);
        if (filters) {
            this.localDisk.push(`filters:`);
            for (const filter of filters) {
                // Lvl2: Array of filters
                this.localDisk.push(`${YAML_INDENT.repeat(1)}- {field: ${filter.field}, operator: ${filter.operator}${filter.value !== undefined ? (",value: " + filter.value)
                    : ""}}`);
            }
        }

        return this.goNext(handlerResponse);
    }
}
