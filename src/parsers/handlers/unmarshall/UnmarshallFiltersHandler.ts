import { DiskHandlerResponse } from "cdm/MashallModel";
import { OperatorFilter, YAML_INDENT } from "helpers/Constants";
import { AbstractDiskHandler } from "parsers/handlers/unmarshall/AbstractDiskPropertyHandler";
import { DataviewService } from "services/DataviewService";

export class UnmarshallFiltersHandler extends AbstractDiskHandler {
    handlerName: string = 'filters';

    public handle(handlerResponse: DiskHandlerResponse): DiskHandlerResponse {
        const { filters } = handlerResponse.yaml;
        // Lvl1: filters
        this.localDisk.push(`${this.handlerName}:`);
        if (filters) {
            for (const filter of filters) {
                // Lvl2: Array of filters
                this.localDisk.push(`${YAML_INDENT.repeat(1)}- {field: ${DataviewService.getDataviewAPI().
                    value
                    .isTruthy(filter.field) ? filter.field : "\"\""
                    }, operator: ${DataviewService.getDataviewAPI()
                        .value
                        .isTruthy(filter.operator) ? filter.operator : "\"\""
                    }, value: ${DataviewService.getDataviewAPI()
                        .value
                        .isTruthy(filter.value) ? filter.value : "\"\""
                    }}`
                );
            }
        }

        return this.goNext(handlerResponse);
    }
}
