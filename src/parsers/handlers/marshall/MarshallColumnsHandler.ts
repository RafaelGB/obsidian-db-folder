import { YamlHandlerResponse } from 'cdm/MashallModel';
import { DataTypes } from 'helpers/Constants';
import { AbstractYamlHandler } from 'parsers/handlers/marshall/AbstractYamlPropertyHandler';

export class MarshallColumnsHandler extends AbstractYamlHandler {
    handlerName: string = 'columns';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;
        if (!yaml.columns) {
            // if columns is not defined, load default
            this.addError(`There was not columns in yaml. Default will be loaded`);
            yaml.columns = {
                Column1: {
                    input: DataTypes.TEXT,
                    accessor: 'Column1',
                    key: 'Column1',
                    label: 'Column 1',
                    position: 1,
                    config: {
                        enable_media_view: true,
                        media_width: 100,
                        media_height: 100,
                        isInline: false
                    }
                }
            };
        }
        // Check every column
        Object.keys(yaml.columns)
            .filter(key => !yaml.columns[key].isMetadata)
            .forEach((key) => {
                const column = yaml.columns[key];
                if (!column.input) {
                    this.addError(`There was not input in column ${key}`);
                    yaml.columns[key].input = DataTypes.TEXT;
                }
                if (!column.accessor) {
                    this.addError(`There was not accessor in column ${key}`);
                    yaml.columns[key].accessor = key;
                }
                if (!column.key) {
                    this.addError(`There was not key in column ${key}`);
                    yaml.columns[key].key = key;
                }
                if (!column.label) {
                    this.addError(`There was not label in column ${key}`);
                    yaml.columns[key].label = key;
                }
                if (!column.config && !(column.config instanceof Object)) {
                    this.addError(`There was not config in column ${key}`);
                    column.config = {
                        enable_media_view: true,
                        media_width: 100,
                        media_height: 100,
                        isInline: false
                    };
                    yaml.columns[key] = column;
                } else {
                    if (!column.config.enable_media_view) {
                        column.config.enable_media_view = true;
                        yaml.columns[key] = column;
                    }
                    if (!column.config.media_width) {
                        column.config.media_width = 100;
                        yaml.columns[key] = column;
                    }
                    if (!column.config.media_height) {
                        column.config.media_height = 100;
                        yaml.columns[key] = column;
                    }
                    if (!column.config.isInline) {
                        column.config.isInline = false;
                        yaml.columns[key] = column;
                    }
                }

            });
        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }
}