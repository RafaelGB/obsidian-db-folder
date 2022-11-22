import { TFile } from "obsidian"
import { TableColumn } from "cdm/FolderModel"
import { LocalSettings } from "cdm/SettingsModel"
import { Literal } from "obsidian-dataview"

export type EditArguments = {
    file: TFile,
    columnId: string,
    newValue: Literal,
    columns: TableColumn[],
    ddbbConfig: LocalSettings,
    option: string
}