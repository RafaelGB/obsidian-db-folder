import { DataTypes, OperatorFilter } from 'helpers/Constants';
import { AbstractYamlHandler, YamlHandlerResponse } from 'parsers/handlers/AbstractYamlPropertyHandler';

export class FiltersHandler extends AbstractYamlHandler {
    handlerName: string = 'columns';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;

        if (!yaml.filters) {
            this.addError('filters key missing. Was added with default value');
            yaml.filters = [];
        }
        for (const filter of yaml.filters) {
            if (!filter.field) {
                this.addError(`There was not field key in filter.`);
                yaml.filters.splice(yaml.filters.indexOf(filter), 1);
            }
            if (!filter.operator) {
                this.addError(`There was not operator key in filter.`);
                yaml.filters.splice(yaml.filters.indexOf(filter), 1);
            }
            if (filter.operator !== OperatorFilter.EXISTS && !filter.value) {
                this.addError(`There was not value key in filter.`);
                yaml.filters.splice(yaml.filters.indexOf(filter), 1);
            }
        }

        return this.goNext(handlerResponse);
    }
}