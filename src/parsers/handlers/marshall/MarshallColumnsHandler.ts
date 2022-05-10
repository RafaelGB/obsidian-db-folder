import { YamlHandlerResponse } from 'cdm/MashallModel';
import { DataTypes } from 'helpers/Constants';
import { AbstractYamlHandler } from 'parsers/handlers/marshall/AbstractYamlPropertyHandler';

export class MarshallColumnsHandler extends AbstractYamlHandler {
    handlerName: string = 'columns';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;
        if (!yaml.columns) {
            // if columns is not defined, load default
            this.addError(`There was not column key in yaml. Default will be loaded`);
            this.localYaml.columns = {
                Column1: {
                    input: DataTypes.TEXT,
                    accessor: 'Column1',
                    key: 'Column1',
                    label: 'Column 1',
                    position: 1
                }
            };
        }

        return this.goNext(handlerResponse);
    }
}