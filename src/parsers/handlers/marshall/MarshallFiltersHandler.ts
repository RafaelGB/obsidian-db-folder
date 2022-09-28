import { DatabaseYaml } from 'cdm/DatabaseModel';
import { YamlHandlerResponse } from 'cdm/MashallModel';
import { AtomicFilter, FilterGroup, FilterGroupCondition } from 'cdm/SettingsModel';
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
            this.validateFilter(filter, yaml) || yaml.filters.conditions.splice(yaml.filters.conditions.indexOf(filter), 1);

        }
        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }

    validateFilter(filter: FilterGroup, yaml: DatabaseYaml): boolean {
        // Is a filter group
        if ((filter as FilterGroupCondition).condition) {
            if (!DataviewService.isTruthy((filter as FilterGroupCondition).condition)) {
                this.addError(`There was not condition key in filter: ${JSON.stringify(filter)}`);
                return false;
            }
            for (const group of (filter as FilterGroupCondition).filters) {
                this.validateFilter(group, yaml);
            }
            // Is a single filter
        } else {
            // Key of filter: Mandatory
            if (!DataviewService.isTruthy((filter as AtomicFilter).field)) {
                this.addError(`undefined field in filter: ${JSON.stringify(filter)}`);
                return false;
            }
            // Operator of filter: Mandatory
            if (!DataviewService.isTruthy((filter as AtomicFilter).operator)) {
                this.addError(`There was not operator key in filter: ${JSON.stringify(filter)}`);
                return false;
            }
        }
        return true;
    }
}
