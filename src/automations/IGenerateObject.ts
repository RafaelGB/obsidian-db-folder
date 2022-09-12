import { LocalSettings } from "cdm/SettingsModel";

export interface IGenerateObject {
    generate_object(config: LocalSettings): Promise<Record<string, unknown>>;
}
