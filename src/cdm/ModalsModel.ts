import { RowDataType, TableColumn } from "cdm/FolderModel";
import { ColumnsState, ConfigState, DataState, RowTemplateState } from "cdm/TableStateInterface";
import { ColumnSettingsManager } from "components/modals/columnSettings/ColumnSettingsModal";
import { AddColumnModalManager } from "components/modals/newColumn/addColumnModal";
import { FilterSettings, LocalSettings } from "cdm/SettingsModel";
import { HeaderMenuProps } from "cdm/HeaderModel";
import { DatabaseView } from "DatabaseView";
import { FiltersModalManager } from "components/modals/filters/FiltersModal";
import { Table } from "@tanstack/react-table";
import { AddRowModalManager } from "components/modals/addRow/AddRowModal";

/**
 * Base class for all modal responses.
 */
type BaseModalHandlerResponse = {
    containerEl: HTMLElement;
};

/***************************************
 *      COLUMN SETTINGS MODAL
 ***************************************/

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
    columnState: Pick<ColumnsState, "info" | "actions">,
    configState: Pick<ConfigState, "info">,
    view: DatabaseView,
    headerMenuProps: HeaderMenuProps
}

/***************************************
 *         ADD COLUMN MODAL
 ***************************************/

/**
 * Response for the AddColumnModal.
 * @extends BaseModalHandlerResponse
 */
export type AddColumnModalHandlerResponse = {
    addColumnModalManager: AddColumnModalManager,
} & BaseModalHandlerResponse;

export type AddColumnModalProps = {
    columnsState: Partial<ColumnsState>;
    ddbbConfig: LocalSettings,
    filters: FilterSettings
}

/***************************************
 *         ADD ROW MODAL
 ***************************************/

/**
 * Response for the AddRowModal.
 * @extends BaseModalHandlerResponse
 */
export type AddRowModalHandlerResponse = {
    addRowModalManager: AddRowModalManager,
} & BaseModalHandlerResponse;

export type AddRowModalProps = {
    dataState: Pick<DataState, "actions">,
    columnsState: Pick<ColumnsState, "info">,
    rowTemplate: Pick<RowTemplateState, "options" | "template" | "update">,
    ddbbConfig: LocalSettings,
    view: DatabaseView,
    table: Table<RowDataType>
}

/***************************************
 *         FILTERS  MODAL
 ***************************************/

/** Filters Modal */
export type FiltersModalProps = {
    table: Table<RowDataType>,
    possibleColumns: string[]
}
export type FiltersModalHandlerResponse = {
    filtersModalManager: FiltersModalManager
} & BaseModalHandlerResponse;