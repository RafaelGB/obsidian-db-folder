import { DiskHandlerResponse } from "cdm/MashallModel";
import { LocalSettings } from "cdm/SettingsModel";
import { InputType, YAML_INDENT } from "helpers/Constants";
import { escapeSpecialCharacters } from "parsers/EscapeHelper";
import { AbstractDiskHandler } from "parsers/handlers/unmarshall/AbstractDiskPropertyHandler";
import { DataviewService } from "services/DataviewService";

export class UnmarshallConfigHandler extends AbstractDiskHandler {
    handlerName: string = 'config';

    public handle(handlerResponse: DiskHandlerResponse): DiskHandlerResponse {
        const { config } = handlerResponse.yaml;
        // Lvl1: config
        this.localDisk.push(`${this.handlerName}:`);
        Object.entries(config).forEach(([key, valueConfig]) => {
            if (typeof valueConfig === 'object') {
                this.localDisk.push(`${YAML_INDENT.repeat(1)}${key}:`);
                Object.entries(valueConfig).forEach(([key, valueInternal]) => {
                    // Lvl3: config properties
                    this.localDisk.push(`${YAML_INDENT.repeat(2)}${key}: "${parseValue(valueInternal as string, config)}"`);
                });
            } else if (typeof valueConfig == "string") {
                this.localDisk.push(`${YAML_INDENT.repeat(1)}${key}: "${parseValue(escapeSpecialCharacters(valueConfig), config)}"`);
            } else {
                // Lvl2: config properties
                this.localDisk.push(`${YAML_INDENT.repeat(1)}${key}: "${parseValue(valueConfig, config)}"`);
            }
        });
        return this.goNext(handlerResponse);
    }
}

function parseValue(value: string, localSettings: LocalSettings): string {
    return DataviewService.parseLiteral(value, InputType.MARKDOWN, localSettings).toString();
}