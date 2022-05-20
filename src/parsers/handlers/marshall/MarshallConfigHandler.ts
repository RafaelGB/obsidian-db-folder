import { YamlHandlerResponse } from 'cdm/MashallModel';
import { AbstractYamlHandler } from 'parsers/handlers/marshall/AbstractYamlPropertyHandler';

export class MarshallConfigHandler extends AbstractYamlHandler {
    handlerName: string = 'configuration';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;
        // check if config is defined. If not, load default
        if (yaml.config) {
            // if enable_show_state is not defined, load default
            if (checkNullable(yaml.config.enable_show_state)) {
                this.addError(`There was not enable_debug_mode key in yaml. Default will be loaded`);
                yaml.config.enable_show_state = false;
            }

            // if group_folder_column is not defined, load default
            if (checkNullable(yaml.config.group_folder_column)) {
                yaml.config.group_folder_column = '';
            }

            // if remove_field_when_delete_column is not defined, load default
            if (checkNullable(yaml.config.remove_field_when_delete_column)) {
                this.addError(`There was not remove_field_when_delete_column key in yaml. Default will be loaded`);
                yaml.config.remove_field_when_delete_column = false;
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

            // if media_settings is not defined, load default
            if (checkNullable(yaml.config.media_settings)) {
                this.addError(`There was not media_settings key in yaml. Default will be loaded`);
                yaml.config.media_settings = {
                    enable_media_view: true,
                    width: 100,
                    height: 100
                };
            } else {
                // otherwise, check if the media_settings fields are defined
                if (checkNullable(yaml.config.media_settings.enable_media_view)) {
                    this.addError(`There was not enable_media_view key in yaml. Default will be loaded`);
                    yaml.config.media_settings.enable_media_view = true;
                }

                if (checkNullable(yaml.config.media_settings.width)) {
                    this.addError(`There was not width key in yaml. Default will be loaded`);
                    yaml.config.media_settings.width = 100;
                }

                if (checkNullable(yaml.config.media_settings.height)) {
                    this.addError(`There was not height key in yaml. Default will be loaded`);
                    yaml.config.media_settings.height = 100;
                }

            }
        }
        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }
}

function checkNullable<T>(value: T): boolean {
    return value === null || value === undefined;
}