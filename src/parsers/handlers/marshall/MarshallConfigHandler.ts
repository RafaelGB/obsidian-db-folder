import { YamlHandlerResponse } from 'cdm/MashallModel';
import { LocalSettings } from 'cdm/SettingsModel';
import { SourceDataTypes, CellSizeOptions, DEFAULT_SETTINGS } from 'helpers/Constants';
import { Literal } from 'obsidian-dataview';
import { AbstractYamlHandler } from 'parsers/handlers/marshall/AbstractYamlPropertyHandler';

export class MarshallConfigHandler extends AbstractYamlHandler {
    handlerName = 'configuration';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;
        if (this.checkNullable(yaml.config)) {
            yaml.config = DEFAULT_SETTINGS.local_settings;
            this.addError(`configuration was null or undefined, using default configuration instead`);
        } else {
            Object.entries(DEFAULT_SETTINGS.local_settings).forEach(([key, value]) => {
                if (this.checkNullable(yaml.config[key as keyof LocalSettings])) {
                    yaml.config = this.loadDefaultConfig(key, value, yaml.config);
                    if (value !== "") {
                        this.addError(`There was not "${key}" key in yaml. Default value "${value}" will be loaded`);
                    }
                }
                // Check type of default value
                if (typeof value === "boolean") {
                    yaml.config = this.parseBoolean(key, yaml.config);
                }
            });
        }
        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }

    loadDefaultConfig<K extends keyof LocalSettings>(key: K, value: Literal, localSettings: LocalSettings): LocalSettings {
        localSettings[key] = value as any;
        return localSettings;
    }

    checkNullable<T>(value: T): boolean {
        return value === null || value === undefined;
    }

    parseBoolean<K extends keyof LocalSettings>(key: K, localSettings: LocalSettings): LocalSettings {
        const parsedValue = localSettings[key].toString().toLowerCase() === 'true';
        localSettings[key] = parsedValue as any;
        return localSettings;
    }
}

