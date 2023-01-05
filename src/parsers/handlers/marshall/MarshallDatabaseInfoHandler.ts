import { YamlHandlerResponse } from 'cdm/MashallModel';
import { AbstractYamlHandler } from 'parsers/handlers/marshall/AbstractYamlPropertyHandler';

export class MarshallDatabaseInfoHandler extends AbstractYamlHandler {
    handlerName = 'baseInfo';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;
        if (!yaml.name || yaml.name.length === 0) {
            this.addError(`Name of database is empty or is not defined value: ${yaml.name}`);
            // handle is ended if name of database is empty or not defined
        }

        if (!yaml.description) {
            // handle continues if description is not defined. Its optional
            yaml.description = '';
        }

        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }
}
