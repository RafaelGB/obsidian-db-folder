import { DatabaseColumn } from 'cdm/DatabaseModel';
import { YamlHandlerResponse } from 'cdm/MashallModel';
import { RowSelectOption } from 'cdm/ComponentsModel';
import { DataTypes, DEFAULT_COLUMN_CONFIG } from 'helpers/Constants';
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
            .forEach((key) => {
                const column = yaml.columns[key];
                /** BASE COLUMN INFO */
                if (!column.input) {
                    this.addError(`There was not input in column ${key}`);
                    yaml.columns[key].input = DataTypes.TEXT;
                } else {
                    yaml.columns[key] = marshallParticularInputInfo(column);
                    // PARTICULAR INPUT INFO
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
                /** CONFIG COLUMN INFO */
                if (!column.config && !(column.config instanceof Object)) {
                    column.config = DEFAULT_COLUMN_CONFIG;
                    yaml.columns[key] = column;
                } else {
                    if (column.config.enable_media_view === undefined) {
                        column.config.enable_media_view = DEFAULT_COLUMN_CONFIG.enable_media_view;
                        yaml.columns[key] = column;
                    }
                    if (column.config.media_width === undefined) {
                        column.config.media_width = DEFAULT_COLUMN_CONFIG.media_width;
                        yaml.columns[key] = column;
                    }
                    if (column.config.media_height === undefined) {
                        column.config.media_height = DEFAULT_COLUMN_CONFIG.media_height;
                        yaml.columns[key] = column;
                    }
                    if (column.config.isInline === undefined) {
                        column.config.isInline = DEFAULT_COLUMN_CONFIG.isInline;
                        yaml.columns[key] = column;
                    }
                }
            });
        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }
}

function marshallParticularInputInfo(column: DatabaseColumn): DatabaseColumn {
    switch (column.input) {
        case DataTypes.SELECT:
        case DataTypes.TAGS:
            if (!column.options || !Array.isArray(column.options)) {
                column.options = [];
            } else {
                // Control undefined or null labels and backgroundColors
                column.options = column.options.filter((option: RowSelectOption) => {
                    return option.backgroundColor
                        && option.label
                        && option.label !== ''
                        && option.backgroundColor !== '';
                    // Control duplicates labels in options
                }).filter((option: RowSelectOption, index: number, self: RowSelectOption[]) => {
                    return self.findIndex((t: RowSelectOption) => {
                        return t.label === option.label;
                    }) === index;
                }
                );
            }
            break;
    }
    return column;
}