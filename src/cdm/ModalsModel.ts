import { TableColumn } from "cdm/FolderModel";
import { ColumnSettingsManager } from "components/modals/columnSettings/ColumnModal";
import { AddColumnModalManager } from "components/modals/newColumn/addColumnModal";
import { DatabaseView } from "DatabaseView";

type BaseModalHandlerResponse = {
    containerEl: HTMLElement;
    view: DatabaseView,
};

export type ColumnSettingsHandlerResponse = {
    column: TableColumn,
    columnSettingsManager: ColumnSettingsManager
} & BaseModalHandlerResponse

export type AddColumnModalHandlerResponse = {
    addColumnModalManager: AddColumnModalManager
} & BaseModalHandlerResponse