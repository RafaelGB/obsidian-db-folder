import { DatabaseColumn } from 'cdm/DatabaseModel';
import { YamlHandlerResponse } from 'cdm/MashallModel';
import { RowSelectOption } from 'cdm/ComponentsModel';
import { InputType, DEFAULT_COLUMN_CONFIG } from 'helpers/Constants';
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
                    input: InputType.TEXT,
                    accessorKey: 'Column1',
                    key: 'Column1',
                    label: 'Column 1',
                    position: 1,
                    config: DEFAULT_COLUMN_CONFIG
                }
            };
        }
        // Check every column
        Object.keys(yaml.columns)
            .forEach((key) => {
                let column = yaml.columns[key];
                /** BASE COLUMN INFO */
                if (!column.input) {
                    this.addError(`There was not input in column ${key}`);
                    column.input = InputType.TEXT;
                } else {
                    column = marshallParticularInputInfo(column);
                    // PARTICULAR INPUT INFO
                }
                if (!column.accessorKey) {
                    this.addError(`There was not accessorKey in column ${key}`);
                    column.accessorKey = key;
                }
                if (!column.key) {
                    this.addError(`There was not key in column ${key}`);
                    column.key = key;
                }
                if (!column.label) {
                    this.addError(`There was not label in column ${key}`);
                    column.label = key;
                }
                if (column.skipPersist === undefined) {
                    column.skipPersist = false;
                }

                /** CONFIG COLUMN INFO */
                if (!column.config && !(column.config instanceof Object)) {
                    column.config = DEFAULT_COLUMN_CONFIG;
                } else {
                    // General config
                    if (column.config.isInline === undefined) {
                        column.config.isInline = DEFAULT_COLUMN_CONFIG.isInline;
                    }
                    column = marshallParticularConfigInfo(column);
                }
                // Update mashaller response
                yaml.columns[key] = column;
            });
        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }
}

function marshallParticularInputInfo(column: DatabaseColumn): DatabaseColumn {
    switch (column.input) {
        case InputType.SELECT:
        case InputType.TAGS:
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

function marshallParticularConfigInfo(column: DatabaseColumn): DatabaseColumn {
    switch (column.input) {
        case InputType.TEXT:
            if (column.config.enable_media_view === undefined) {
                column.config.enable_media_view = DEFAULT_COLUMN_CONFIG.enable_media_view;
            }
            if (column.config.media_width === undefined) {
                column.config.media_width = DEFAULT_COLUMN_CONFIG.media_width;
            }
            if (column.config.media_height === undefined) {
                column.config.media_height = DEFAULT_COLUMN_CONFIG.media_height;
            }
        case InputType.TASK:
            if (column.config.task_hide_completed === undefined) {
                column.config.task_hide_completed = DEFAULT_COLUMN_CONFIG.task_hide_completed;
                break;
            }
    }
    return column;
}