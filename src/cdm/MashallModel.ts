import { DatabaseYaml } from "cdm/DatabaseModel";

export type YamlHandlerResponse = {
    yaml: DatabaseYaml,
    errors: Record<string, string[]>,
};
export interface YamlHandler {
    setNext(handler: YamlHandler): YamlHandler;
    handle(yaml: YamlHandlerResponse): YamlHandlerResponse;
}

export type DiskHandlerResponse = {
    yaml: DatabaseYaml,
    disk: string[],
    errors: Record<string, string[]>,
};

export interface DiskHandler {
    setNext(handler: DiskHandler): DiskHandler;
    handle(database: DiskHandlerResponse): DiskHandlerResponse;
}