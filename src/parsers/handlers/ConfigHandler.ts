import { DataTypes } from 'helpers/Constants';
import { AbstractYamlHandler, YamlHandlerResponse } from 'parsers/handlers/AbstractYamlPropertyHandler';

export class ConfigHandler extends AbstractYamlHandler {
    handlerName: string = 'configuration';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        // check if config is defined. If not, load default
        if (handlerResponse.yaml.config) {
            this.localYaml.config = handlerResponse.yaml.config;
            // if enable_show_state is not defined, load default
            if (handlerResponse.yaml.config.enable_show_state === undefined) {
                this.addError(`There was not enable_debug_mode key in yaml. Default will be loaded`);
                this.localYaml.config.enable_show_state = false;
            }
            // if group_folder_column is not defined, load default
            if (handlerResponse.yaml.config.group_folder_column === undefined) {
                this.addError(`There was not group_folder_column key in yaml. Default will be loaded`);
                this.localYaml.config.group_folder_column = '';
            }
        }
        return this.goNext(handlerResponse);
    }
}