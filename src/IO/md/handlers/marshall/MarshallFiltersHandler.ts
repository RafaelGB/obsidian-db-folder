import { DatabaseYaml } from 'cdm/DatabaseModel';
import { YamlHandlerResponse } from 'cdm/MashallModel';
import { AtomicFilter, FilterGroup, FilterGroupCondition } from 'cdm/SettingsModel';
import { InputType } from 'helpers/Constants';
import { AbstractYamlHandler } from 'IO/md/handlers/marshall/AbstractYamlPropertyHandler';
import { DataviewService } from 'services/DataviewService';

export class MarshallFiltersHandler extends AbstractYamlHandler {
    handlerName = 'columns';

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
            const condition = (filter as FilterGroupCondition).condition;
            const filters = (filter as FilterGroupCondition).filters;
            if (!DataviewService.isTruthy(condition)) {
                this.addError(`There was not condition key in filter: ${JSON.stringify(filter)}`);
                return false;
            }
            for (const group of filters) {
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
            // Type of filter: Optional (if not present, it will be set to TEXT)
            if (!DataviewService.isTruthy((filter as AtomicFilter).type)) {
                (filter as AtomicFilter).type = InputType.TEXT;
            }
        }
        return true;
    }
}
