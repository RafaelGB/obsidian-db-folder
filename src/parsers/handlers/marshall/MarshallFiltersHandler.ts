import { YamlHandlerResponse } from 'cdm/MashallModel';
import { AbstractYamlHandler } from 'parsers/handlers/marshall/AbstractYamlPropertyHandler';
import { DataviewService } from 'services/DataviewService';

export class MarshallFiltersHandler extends AbstractYamlHandler {
    handlerName: string = 'columns';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;

        if (yaml.filters === undefined || !yaml.filters) {
            this.addError(`undefined filters group. Loading default`);
            yaml.filters = {
                enabled: false,
                conditions: []
            };
        }

        if (yaml.filters.conditions === undefined || !yaml.filters.conditions) {
            yaml.filters.conditions = [];
        }

        if (yaml.filters.enabled === undefined) {
            this.addError(`undefined enabled filters configuration. Loading default`);
            yaml.filters.enabled = false;
        }

        for (const filter of yaml.filters.conditions) {
            if (!DataviewService.isTruthy(filter.field)) {
                this.addError(`undefined field in filter: ${JSON.stringify(filter)}`);
                yaml.filters.conditions.splice(yaml.filters.conditions.indexOf(filter), 1);
            }
            else if (!DataviewService.isTruthy(filter.operator)) {
                this.addError(`There was not operator key in filter: ${JSON.stringify(filter)}`);
                yaml.filters.conditions.splice(yaml.filters.conditions.indexOf(filter), 1);
            }
            else if (!DataviewService.isTruthy(filter.value)) {
                this.addError(`undefined value in filter: ${JSON.stringify(filter)}`);
                yaml.filters.conditions.splice(yaml.filters.conditions.indexOf(filter), 1);
            }
        }
        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }
}