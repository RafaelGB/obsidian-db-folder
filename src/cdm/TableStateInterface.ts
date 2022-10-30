import { ColumnOrderState, SortingState } from "@tanstack/react-table";
import { ConfigColumn, RowDataType, TableColumn } from "cdm/FolderModel";
import { FilterSettings, GlobalSettings, LocalSettings } from "cdm/SettingsModel";
import { DatabaseView } from "DatabaseView";
import { Link, Literal } from "obsidian-dataview";
import { StoreApi, UseBoundStore } from "zustand";

export type TableActionResponse<T> = {
    view: DatabaseView,
    set: (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean) => void,
    get: () => T,
    implementation: T
}

export type TableAction<T> = {
    setNext(handler: TableAction<T>): TableAction<T>;
    handle(settingHandlerResponse: TableActionResponse<T>): TableActionResponse<T>;
}
/**
 * TABLE STATE INTERFACE
 */
export interface ConfigState {
    ddbbConfig: LocalSettings;
    filters: FilterSettings;
    global: GlobalSettings;
    actions: {
        alterFilters: (filters: Partial<FilterSettings>) => Promise<void>;
        alterConfig: (config: Partial<LocalSettings>) => void;
    }
    info: {
        getLocalSettings: () => LocalSettings;
        getFilters: () => FilterSettings;
    }
}

export interface DataState {
    rows: RowDataType[];
    actions: {
        addRow: (filename: string, columns: TableColumn[], ddbbConfig: LocalSettings) => Promise<void>;
        updateCell: (rowIndex: number, column: TableColumn, value: Literal, columns: TableColumn[], ddbbConfig: LocalSettings, isMovingFile?: boolean) => Promise<void>;
        parseDataOfColumn: (column: TableColumn, input: string, ddbbConfig: LocalSettings) => void;
        updateDataAfterLabelChange: (column: TableColumn, label: string, columns: TableColumn[], ddbbConfig: LocalSettings) => Promise<void>;
        removeRow: (row: RowDataType) => Promise<void>;
        removeDataOfColumn: (column: TableColumn) => void;
        editOptionForAllRows: (column: TableColumn, oldLabel: string, newLabel: string, columns: TableColumn[], ddbbConfig: LocalSettings) => Promise<void>;
        removeOptionForAllRows: (column: TableColumn, option: string, columns: TableColumn[],
            ddbbConfig: LocalSettings) => Promise<void>;
        dataviewRefresh: (column: TableColumn[], ddbbConfig: LocalSettings, filterConfig: FilterSettings) => void;
        renameFile: (rowIndex: number) => Promise<void>;
        saveDataFromFile: (file: File, columns: TableColumn[], config: LocalSettings) => Promise<void>;
        groupFiles: () => Promise<void>;
    }
}

export interface ColumnsState {
    columns: TableColumn[];
    shadowColumns: TableColumn[];
    actions: {
        addToLeft: (column: TableColumn, customName?: string) => void;
        addToRight: (column: TableColumn, customName?: string) => void;
        remove: (column: TableColumn) => void;
        alterSorting: (column: TableColumn) => void;
        addOptionToColumn: (column: TableColumn, option: string, backgroundColor: string) => void;
        alterColumnType: (column: TableColumn, input: string, parsedRows?: RowDataType[]) => Promise<void>;
        alterColumnId: (column: TableColumn, root: string, nestedIds: string[]) => Promise<void>;
        alterColumnLabel: (column: TableColumn, label: string) => Promise<void>;
        alterColumnSize: (id: string, width: number) => void;
        alterIsHidden: (column: TableColumn, isHidden: boolean) => void;
    }
    info: {
        getAllColumns: () => TableColumn[];
        getValueOfAllColumnsAsociatedWith: <K extends keyof TableColumn>(key: K) => TableColumn[K][];
        getVisibilityRecord: () => Record<string, boolean>;
    }
}
export interface ColumnSortingState {
    sortBy: SortingState;
    actions: {
        alterSorting: (alternativeSorting: SortingState) => void;
    }
}
export interface RowTemplateState {
    template: string;
    folder: string;
    options: { value: string, label: string }[],
    clear: () => void;
    update: (template: string) => void;
}

export interface AutomationState {
    formula: { [key: string]: unknown };
    info: {
        getFormula: (name: string) => unknown;
        runFormula: (input: string, row: RowDataType, dbbConfig: LocalSettings) => Literal;
        dispatchRollup: (configColumn: ConfigColumn, relation: Literal, dbbConfig: LocalSettings) => Literal;
    },
    actions: {
        loadFormulas: (ddbbConfig: LocalSettings) => Promise<void>;
    }
}

export interface TableStateInterface {
    automations: UseBoundStore<StoreApi<AutomationState>>;
    configState: UseBoundStore<StoreApi<ConfigState>>;
    rowTemplate: UseBoundStore<StoreApi<RowTemplateState>>;
    data: UseBoundStore<StoreApi<DataState>>;
    sorting: UseBoundStore<StoreApi<ColumnSortingState>>;
    columns: UseBoundStore<StoreApi<ColumnsState>>;
}
