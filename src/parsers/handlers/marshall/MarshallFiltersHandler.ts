import { YamlHandlerResponse } from 'cdm/MashallModel';
import { AbstractYamlHandler } from 'parsers/handlers/marshall/AbstractYamlPropertyHandler';

export class FiltersHandler extends AbstractYamlHandler {
    handlerName: string = 'columns';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;

        if (yaml.filters === undefined || !yaml.filters) {
            yaml.filters = [];
        }
        for (const filter of yaml.filters) {
            if (filter.field === undefined) {
                this.addError(`There was not field key in filter.`);
                yaml.filters.splice(yaml.filters.indexOf(filter), 1);
            }
            if (filter.operator === undefined) {
                this.addError(`There was not operator key in filter.`);
                yaml.filters.splice(yaml.filters.indexOf(filter), 1);
            }
            if (filter.value === undefined) {
                this.addError(`There was not value key in filter.`);
                yaml.filters.splice(yaml.filters.indexOf(filter), 1);
            }
        }

        return this.goNext(handlerResponse);
    }
}