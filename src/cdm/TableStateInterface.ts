import { SortingState } from "@tanstack/react-table";
import { ConfigColumn, RowDataType, TableColumn } from "cdm/FolderModel";
import { FilterSettings, GlobalSettings, LocalSettings } from "cdm/SettingsModel";
import { ColumnOption } from "cdm/ComponentsModel";
import { Literal } from "obsidian-dataview";
import { StoreApi, UseBoundStore } from "zustand";
import { UpdaterData, ContextHeaderData } from "cdm/EmitterModel";
import { CustomView } from "views/AbstractView";

export type TableActionResponse<T> = {
    view: CustomView,
    set: (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean) => void,
    get: () => T,
    implementation: T
}

export type TableAction<T> = {
    setNext(handler: TableAction<T>): TableAction<T>;
    handle(settingHandlerResponse: TableActionResponse<T>): TableActionResponse<T>;
}
/************************
 * EPHEMERAL STATE
 ************************/
export type EphimeralSettings = {
    enable_columns_filter: boolean,
    enable_navbar: boolean,
    context_header: ContextHeaderData
}
/************************
 * CONFIG STATE
 ************************/
export type ConfigStateActions = {
    alterFilters: (filters: Partial<FilterSettings>) => Promise<void>;
    alterConfig: (config: Partial<LocalSettings>) => void;
    alterEphimeral: (ephimeral: Partial<EphimeralSettings>) => Promise<void>;
}

export type ConfigStateInfo = {
    getLocalSettings: () => LocalSettings;
    getFilters: () => FilterSettings;
    getEphimeralSettings: () => EphimeralSettings;
}

export interface ConfigState {
    ddbbConfig: LocalSettings;
    filters: FilterSettings;
    global: GlobalSettings;
    ephimeral: EphimeralSettings;
    actions: ConfigStateActions
    info: ConfigStateInfo
}
/************************
 * DATA STATE
 ************************/
export type CreateRowInfo = {
    filename: string,
    columns: TableColumn[],
    ddbbConfig: LocalSettings
}

export type UpdateRowInfo = {
    rowIndex: number,
    column: TableColumn,
    value: Literal,
    columns: TableColumn[],
    ddbbConfig: LocalSettings,
    isMovingFile?: boolean,
    saveOnDisk?: boolean
}

export type DataStateActions = {
    insertRows: () => Promise<void>;
    addRow: (args: CreateRowInfo) => Promise<void>;
    updateCell: (args: UpdateRowInfo) => Promise<void>;
    updateBidirectionalRelation: (source: RowDataType, column: TableColumn, oldPaths: string[], newPaths: string[]) => Promise<void>;
    parseDataOfColumn: (column: TableColumn, input: string, ddbbConfig: LocalSettings) => void;
    updateDataAfterLabelChange: (column: TableColumn, label: string, columns: TableColumn[], ddbbConfig: LocalSettings) => Promise<void>;
    removeRow: (row: RowDataType) => Promise<void>;
    removeDataOfColumn: (updater: Omit<UpdateRowInfo, "rowIndex" | "value">) => void;
    editOptionForAllRows: (column: TableColumn, oldLabel: string, newLabel: string, columns: TableColumn[], ddbbConfig: LocalSettings) => Promise<void>;
    removeOptionForAllRows: (column: TableColumn, option: string, columns: TableColumn[],
        ddbbConfig: LocalSettings) => Promise<void>;
    dataviewRefresh: (column: TableColumn[], ddbbConfig: LocalSettings, filterConfig: FilterSettings) => Promise<void>;
    dataviewUpdater: (updaterData: UpdaterData, columns: TableColumn[], ddbbConfig: LocalSettings, filterConfig: FilterSettings) => Promise<void>;
    renameFile: (rowIndex: number) => Promise<void>;
    importRowsFromCSV: (file: File, columns: TableColumn[], config: LocalSettings) => Promise<void>;
    groupFiles: () => Promise<void>;
    bulkRowUpdate: (rows: RowDataType[], columns: TableColumn[], action: string) => Promise<void>;
}

export type DataStateInfo = {
    getRows: () => RowDataType[];
}

export interface DataState {
    rows: RowDataType[];
    actions: DataStateActions
    info: DataStateInfo
}

/************************
 * COLUMNS STATE
 ************************/
export type ColumnsStateActions = {
    addToLeft: (column: TableColumn, customName?: string, customType?: string) => void;
    addToRight: (column: TableColumn, customName?: string, customType?: string) => void;
    remove: (column: TableColumn) => Promise<void>;
    alterSorting: (column: TableColumn) => void;
    addOptionToColumn: (column: TableColumn, option: string, backgroundColor: string) => void;
    alterColumnType: (column: TableColumn, input: string, parsedRows?: RowDataType[]) => Promise<void>;
    alterColumnId: (column: TableColumn, root: string, nestedIds: string[]) => Promise<void>;
    alterColumnLabel: (column: TableColumn, label: string) => Promise<void>;
    alterColumnSize: (id: string, width: number) => void;
    alterIsHidden: (column: TableColumn, isHidden: boolean) => void;
    alterColumnConfig: (column: TableColumn, config: Partial<ConfigColumn>) => void;
}

export type ColumnsStateInfo = {
    getAllColumns: () => TableColumn[];
    getValueOfAllColumnsAsociatedWith: <K extends keyof TableColumn>(key: K) => TableColumn[K][];
    getVisibilityRecord: () => Record<string, boolean>;
    getColumnOptions: (id: string, includeEmptyOption?: boolean) => ColumnOption[];
}

export interface ColumnsState {
    columns: TableColumn[];
    shadowColumns: TableColumn[];
    actions: ColumnsStateActions;
    info: ColumnsStateInfo;
}

/************************
 * SORTING STATE
 ************************/
export type SortingStateActions = {
    alterSorting: (alternativeSorting: SortingState) => void;
}
export interface ColumnSortingState {
    sortBy: SortingState;
    actions: SortingStateActions;
}
/************************
 * TEMPLATE STATE
 ************************/
export interface RowTemplateState {
    template: string;
    folder: string;
    options: { value: string, label: string }[],
    clear: () => void;
    update: (template: string) => void;
}
/************************
 * AUTOMATION STATE
 ************************/
export type AutomationStateActions = {
    loadFormulas: (ddbbConfig: LocalSettings) => Promise<void>;
}

export type AutomationStateInfo = {
    getFormula: (name: string) => unknown;
    runFormula: (input: string, row: RowDataType, dbInfo: DbInfo) => Literal;
    dispatchFooter: (column: TableColumn, colValues: Literal[]) => Literal;
    dispatchRollup: (configColumn: ConfigColumn, relation: Literal) => Literal;
}
export interface AutomationState {
    formula: { [key: string]: unknown };
    actions: AutomationStateActions;
    info: AutomationStateInfo;
}

/************************
 * TABLE STATE INTERFACE
 ************************/
export interface TableStateInterface {
    automations: UseBoundStore<StoreApi<AutomationState>>;
    configState: UseBoundStore<StoreApi<ConfigState>>;
    rowTemplate: UseBoundStore<StoreApi<RowTemplateState>>;
    data: UseBoundStore<StoreApi<DataState>>;
    sorting: UseBoundStore<StoreApi<ColumnSortingState>>;
    columns: UseBoundStore<StoreApi<ColumnsState>>;
}

/************************
 * Cross state types
 ************************/
export type DbInfo = {
    data: DataStateInfo;
    columns: ColumnsStateInfo;
    config: ConfigStateInfo;
    automation: AutomationStateInfo;
}