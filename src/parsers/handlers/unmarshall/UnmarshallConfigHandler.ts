import { DiskHandlerResponse } from "cdm/MashallModel";
import { YAML_INDENT } from "helpers/Constants";
import { escapeSpecialCharacters } from "parsers/EscapeHelper";
import { AbstractDiskHandler } from "parsers/handlers/unmarshall/AbstractDiskPropertyHandler";
import { parseValuetoSanitizeYamlValue } from "parsers/RowDatabaseFieldsToFile";

export class UnmarshallConfigHandler extends AbstractDiskHandler {
    handlerName = 'config';

    public handle(handlerResponse: DiskHandlerResponse): DiskHandlerResponse {
        const { config } = handlerResponse.yaml;
        // Lvl1: config
        this.localDisk.push(`${this.handlerName}:`);
        Object.entries(config).forEach(([key, valueConfig]) => {
            if (typeof valueConfig === 'object') {
                this.localDisk.push(`${YAML_INDENT.repeat(1)}${key}:`);
                Object.entries(valueConfig).forEach(([key, valueInternal]) => {
                    // Lvl3: config properties
                    this.localDisk.push(`${YAML_INDENT.repeat(2)}${key}: ${parseValuetoSanitizeYamlValue(valueInternal as string, config)}`);
                });
            } else if (typeof valueConfig === "string") {
                this.localDisk.push(`${YAML_INDENT.repeat(1)}${key}: ${parseValuetoSanitizeYamlValue(escapeSpecialCharacters(valueConfig), config, true)}`);
            } else {
                // Lvl2: config properties
                this.localDisk.push(`${YAML_INDENT.repeat(1)}${key}: ${parseValuetoSanitizeYamlValue(valueConfig, config)}`);
            }
        });
        return this.goNext(handlerResponse);
    }
}