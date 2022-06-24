import { YamlHandlerResponse } from 'cdm/MashallModel';
import { getOperatorFilterValue } from 'helpers/Constants';
import { AbstractYamlHandler } from 'parsers/handlers/marshall/AbstractYamlPropertyHandler';
import { DataviewService } from 'services/DataviewService';

export class MarshallFiltersHandler extends AbstractYamlHandler {
    handlerName: string = 'columns';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;

        if (yaml.filters === undefined || !yaml.filters) {
            yaml.filters = [];
        }
        for (const filter of yaml.filters) {
            if (!DataviewService.isTruthy(filter.field)) {
                this.addError(`undefined field in filter: ${JSON.stringify(filter)}`);
                yaml.filters.splice(yaml.filters.indexOf(filter), 1);
            }
            else if (!DataviewService.isTruthy(filter.operator)) {
                this.addError(`There was not operator key in filter: ${JSON.stringify(filter)}`);
                yaml.filters.splice(yaml.filters.indexOf(filter), 1);
            }
            else if (!DataviewService.isTruthy(filter.value)) {
                this.addError(`undefined value in filter: ${JSON.stringify(filter)}`);
                yaml.filters.splice(yaml.filters.indexOf(filter), 1);
            }
        }
        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }
}