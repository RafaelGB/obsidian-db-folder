import { DiskHandlerResponse } from "cdm/MashallModel";
import { YAML_INDENT } from "helpers/Constants";
import { AbstractDiskHandler } from "parsers/handlers/unmarshall/AbstractDiskPropertyHandler";
import { DataviewService } from "services/DataviewService";

export class UnmarshallFiltersHandler extends AbstractDiskHandler {
    handlerName: string = 'filters';

    public handle(handlerResponse: DiskHandlerResponse): DiskHandlerResponse {
        const { filters } = handlerResponse.yaml;
        // Lvl1: filters
        this.localDisk.push(`${this.handlerName}:`);
        this.localDisk.push(`${YAML_INDENT.repeat(1)}enabled: ${filters.enabled}`);
        this.localDisk.push(`${YAML_INDENT.repeat(1)}conditions:`);
        if (filters.conditions) {
            for (const condition of filters.conditions) {
                // Lvl2: Array of filters
                this.localDisk.push(`${YAML_INDENT.repeat(2)}- {field: ${DataviewService.getDataviewAPI().
                    value
                    .isTruthy(condition.field) ? condition.field : "\"\""
                    }, operator: ${DataviewService.getDataviewAPI()
                        .value
                        .isTruthy(condition.operator) ? condition.operator : "\"\""
                    }, value: ${DataviewService.getDataviewAPI()
                        .value
                        .isTruthy(condition.value) ? condition.value : "\"\""
                    }}`
                );
            }
        }

        return this.goNext(handlerResponse);
    }
}
