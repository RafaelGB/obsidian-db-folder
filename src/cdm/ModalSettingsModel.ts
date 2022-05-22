import { TableColumn } from "cdm/FolderModel";
import { ColumnSettingsManager } from "components/modals/ColumnModal";
import { DatabaseView } from "DatabaseView";

export type ColumnHandlerResponse = {
    containerEl: HTMLElement,
    view: DatabaseView,
    column: TableColumn,
    columnSettingsManager: ColumnSettingsManager
}