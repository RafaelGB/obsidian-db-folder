import { DatabaseColumn } from 'cdm/DatabaseModel';
import { YamlHandlerResponse } from 'cdm/MashallModel';
import { ColumnOption } from 'cdm/ComponentsModel';
import { InputType, DEFAULT_COLUMN_CONFIG } from 'helpers/Constants';
import { AbstractYamlHandler } from 'IO/md/handlers/marshall/AbstractYamlPropertyHandler';
import { Literal } from 'obsidian-dataview';

export class MarshallColumnsHandler extends AbstractYamlHandler {
    handlerName = 'columns';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;
        if (!yaml.columns) {
            // if columns is not defined, load default
            this.addError(`There was not columns in yaml. Default will be loaded`);
            yaml.columns = {};
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
                    column = this.marshallParticularInputInfo(column);
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

                column.position = this.parseNumber(column.position);

                column.skipPersist = this.parseBoolean(column.skipPersist);

                column.isHidden = this.parseBoolean(column.isHidden);

                if (column.sortIndex === undefined || typeof column.sortIndex !== 'number') {
                    column.sortIndex = -1;
                }

                /** CONFIG COLUMN INFO */
                if (!column.config && !(column.config instanceof Object)) {
                    column.config = DEFAULT_COLUMN_CONFIG;
                } else {
                    // General config
                    column.config = {
                        ...DEFAULT_COLUMN_CONFIG,
                        ...column.config
                    }

                    column.config.isInline = this.parseBoolean(column.config.isInline);
                    column = this.marshallParticularConfigInfo(column);
                }
                // Update mashaller response
                yaml.columns[key] = column;
            });
        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }

    parseBoolean(value: Literal, defaultValue = false): boolean {
        if (value === undefined || value === null) {
            return defaultValue;
        }

        if (typeof value === 'boolean') {
            return value;
        }

        if (value === 'true') {
            return true;
        } else if (value === 'false') {
            return false;
        }
        return defaultValue;
    }

    parseNumber(value: Literal, defaultValue = 0): number {
        if (value === undefined || value === null) {
            return defaultValue;
        }
        if (typeof value === 'number') {
            return value;
        }
        return Number(value);
    }

    marshallParticularConfigInfo(column: DatabaseColumn): DatabaseColumn {
        switch (column.input) {
            case InputType.TEXT:
                column.config.enable_media_view = this.parseBoolean(column.config.enable_media_view, DEFAULT_COLUMN_CONFIG.enable_media_view);
                column.config.media_width = this.parseNumber(column.config.media_width, DEFAULT_COLUMN_CONFIG.media_width);
                column.config.media_height = this.parseNumber(column.config.media_height, DEFAULT_COLUMN_CONFIG.media_height);
                break;
            case InputType.TASK:
                column.config.task_hide_completed = this.parseBoolean(column.config.task_hide_completed, DEFAULT_COLUMN_CONFIG.task_hide_completed);
                break;
        }
        return column;
    }

    marshallParticularInputInfo(column: DatabaseColumn): DatabaseColumn {
        switch (column.input) {
            case InputType.SELECT:
            case InputType.TAGS:
                if (!column.options || !Array.isArray(column.options)) {
                    column.options = [];
                } else {
                    // Control undefined or null options
                    column.options = column.options.filter((option) => {
                        return option.value !== ""
                            && option.label !== ""
                            && option.color !== "";
                        // Control duplicates labels in options
                    }).filter((option, index, self) => {
                        return self.findIndex((t) => {
                            return t.label === option.label;
                        }) === index;
                    }
                    );
                }
                break;
        }
        return column;
    }
}