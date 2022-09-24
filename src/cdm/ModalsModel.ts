import { RowDataType, TableColumn } from "cdm/FolderModel";
import { ColumnsState, ConfigState, DataState } from "cdm/TableStateInterface";
import { ColumnSettingsManager } from "components/modals/columnSettings/ColumnSettingsModal";
import { AddColumnModalManager } from "components/modals/newColumn/addColumnModal";
import { FilterSettings, LocalSettings } from "cdm/SettingsModel";
import { HeaderMenuProps } from "cdm/HeaderModel";
import { DatabaseView } from "DatabaseView";
import { FiltersModalManager } from "components/modals/filters/FiltersModal";
import { Table } from "@tanstack/react-table";

/**
 * Base class for all modal responses.
 */
type BaseModalHandlerResponse = {
    containerEl: HTMLElement;
};

/**
 * Response for the ColumnSettingsModal.
 * @extends BaseModalHandlerResponse
 */
export type ColumnSettingsHandlerResponse = {
    column: TableColumn,
    columnSettingsManager: ColumnSettingsManager
} & BaseModalHandlerResponse

export type ColumnSettingsModalProps = {
    dataState: Pick<DataState, "actions">,
    columnState: Pick<ColumnsState, "info">,
    configState: Pick<ConfigState, "info">,
    view: DatabaseView,
    headerMenuProps: HeaderMenuProps
}

export type AddColumnModalProps = {
    columnsState: Partial<ColumnsState>;
    ddbbConfig: LocalSettings,
    filters: FilterSettings
}
/**
 * Response for the AddColumnModal.
 * @extends BaseModalHandlerResponse
 */
export type AddColumnModalHandlerResponse = {
    addColumnModalManager: AddColumnModalManager,
} & BaseModalHandlerResponse;

/** Filters Modal */
export type FiltersModalProps = {
    table: Table<RowDataType>,
    possibleColumns: string[]
}
export type FiltersModalHandlerResponse = {
    filtersModalManager: FiltersModalManager
} & BaseModalHandlerResponse;