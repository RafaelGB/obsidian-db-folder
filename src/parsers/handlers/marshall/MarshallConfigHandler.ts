import { YamlHandlerResponse } from 'cdm/MashallModel';
import { SourceDataTypes, CellSizeOptions } from 'helpers/Constants';
import { Literal } from 'obsidian-dataview';
import { AbstractYamlHandler } from 'parsers/handlers/marshall/AbstractYamlPropertyHandler';

export class MarshallConfigHandler extends AbstractYamlHandler {
    handlerName = 'configuration';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;
        // check if config is defined. If not, load default
        if (yaml.config) {
            // if enable_show_state is not defined, load default
            if (checkNullable(yaml.config.enable_show_state)) {
                this.addError(`There was not enable_debug_mode key in yaml. Default will be loaded`);
                yaml.config.enable_show_state = false;
            }
            yaml.config.enable_show_state = parseBoolean(yaml.config.enable_show_state);

            // if group_folder_column is not defined, load empty (optional)
            if (checkNullable(yaml.config.group_folder_column)) {
                yaml.config.group_folder_column = '';
            }

            // if remove_field_when_delete_column is not defined, load default
            if (checkNullable(yaml.config.remove_field_when_delete_column)) {
                this.addError(`There was not remove_field_when_delete_column key in yaml. Default will be loaded`);
                yaml.config.remove_field_when_delete_column = false;
            }
            yaml.config.remove_field_when_delete_column = parseBoolean(yaml.config.remove_field_when_delete_column);

            // if cell_size is not defined, load default
            if (checkNullable(yaml.config.cell_size)) {
                this.addError(`There was not cell_size key in yaml. Default will be loaded`);
                yaml.config.cell_size = CellSizeOptions.NORMAL;
            }

            // if sticky_first_column is not defined, load default
            if (checkNullable(yaml.config.sticky_first_column)) {
                this.addError(`There was not sticky_first_column key in yaml. Default will be loaded`);
                yaml.config.sticky_first_column = false;
            }
            yaml.config.sticky_first_column = parseBoolean(yaml.config.sticky_first_column);

            // if show_metadata_created is not defined, load default
            if (checkNullable(yaml.config.show_metadata_created)) {
                this.addError(`There was not show_metadata_created key in yaml. Default will be loaded`);
                yaml.config.show_metadata_created = false;
            }
            yaml.config.show_metadata_created = parseBoolean(yaml.config.show_metadata_created);

            // if show_metadata_modified is not defined, load default
            if (checkNullable(yaml.config.show_metadata_modified)) {
                this.addError(`There was not show_metadata_modified key in yaml. Default will be loaded`);
                yaml.config.show_metadata_modified = false;
            }
            yaml.config.show_metadata_modified = parseBoolean(yaml.config.show_metadata_modified);

            // if source_data is not defined, load default
            if (checkNullable(yaml.config.source_data)) {
                this.addError(`There was not source_data key in yaml. Default will be loaded`);
                yaml.config.source_data = SourceDataTypes.CURRENT_FOLDER;
            }

            // if source_form_result is not defined, load empty (optional)
            if (checkNullable(yaml.config.source_form_result)) {
                yaml.config.source_form_result = '';
            }
        }
        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }
}

function checkNullable<T>(value: T): boolean {
    return value === null || value === undefined;
}

function parseBoolean(value: Literal): boolean {
    return value.toString().toLowerCase() === 'true';
}