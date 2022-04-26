import { AbstractYamlHandler, YamlHandlerResponse } from 'parsers/handlers/AbstractYamlPropertyHandler';

export class BaseInfoHandler extends AbstractYamlHandler {
    handlerName: string = 'baseInfo';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;
        if (!yaml.name || yaml.name.length === 0) {
            this.addError(`Name of database is empty or is not defined value: ${yaml.name}`);
            // handle is ended if name of database is empty or not defined
        }

        if (!yaml.description) {
            // handle continues if description is not defined. Its optional
            this.localYaml.description = '';
        }

        return this.goNext(handlerResponse);
    }
}
