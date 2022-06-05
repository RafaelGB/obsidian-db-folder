import { YamlHandlerResponse } from 'cdm/MashallModel';
import { SourceDataTypes, CellSizeOptions } from 'helpers/Constants';
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

            // if group_folder_column is not defined, load empty (optional)
            if (checkNullable(yaml.config.group_folder_column)) {
                yaml.config.group_folder_column = '';
            }

            // if remove_field_when_delete_column is not defined, load default
            if (checkNullable(yaml.config.remove_field_when_delete_column)) {
                this.addError(`There was not remove_field_when_delete_column key in yaml. Default will be loaded`);
                yaml.config.remove_field_when_delete_column = false;
            }

            // if cell_size is not defined, load default
            if (checkNullable(yaml.config.cell_size)) {
                this.addError(`There was not cell_size key in yaml. Default will be loaded`);
                yaml.config.cell_size = CellSizeOptions.NORMAL;
            }

            // if show_metadata_created is not defined, load default
            if (checkNullable(yaml.config.show_metadata_created)) {
                this.addError(`There was not show_metadata_created key in yaml. Default will be loaded`);
                yaml.config.show_metadata_created = false;
            }

            // if show_metadata_modified is not defined, load default
            if (checkNullable(yaml.config.show_metadata_modified)) {
                this.addError(`There was not show_metadata_modified key in yaml. Default will be loaded`);
                yaml.config.show_metadata_modified = false;
            }

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