import { TFile } from "obsidian"
import { TableColumn } from "cdm/FolderModel"
import { LocalSettings } from "cdm/SettingsModel"
import { Literal, WrappedLiteral } from "obsidian-dataview"

export type EditArguments = {
    file: TFile,
    columnId: string,
    newValue: Literal,
    columns: TableColumn[],
    ddbbConfig: LocalSettings,
    option: string
}

/********************************
 *      PARSE SERVICE MODEL
********************************/
export abstract class TypeParser<T> {
    config: LocalSettings;

    public setConfig = (config: LocalSettings) => {
        this.config = config;
        return this;
    }

    public parse(wrapped: WrappedLiteral): T {
        return wrapped.value as T;
    }

    public parseLiteral = (wrapped: WrappedLiteral): T => {
        const parsed = this.parse(wrapped);
        return parsed;
    }
}

/********************************
 *          CSV MODEL
 ********************************/
export type CsvHeaders = {
    label: string;
    key: string;
};