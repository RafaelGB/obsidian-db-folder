import { Table } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { FiltersModalManager } from "../domain/FiltersModal";
import { BaseModalHandlerResponse } from "cdm/ModalsModel";

export type FilterGroup = AtomicFilter | FilterGroupCondition;

export type FilterGroupCondition = {
    condition: string;
    disabled: boolean;
    filters: FilterGroup[];
    label?: string;
    color?: string;
}
export type AtomicFilter = {
    field: string;
    operator: string;
    type: string;
    value?: string;
}

/***************************************
 *      FILTERS COMPONENT
***************************************/
export type TableFiltersProps = {
    table: Table<RowDataType>;
};

export type DataviewFiltersProps = {
    table: Table<RowDataType>;
    possibleColumns: ColumnFilterOption[];
} & TableFiltersProps;

export type AtomicFilterComponentProps = {
    recursiveIndex: number[];
    level: number;
    atomicFilter: AtomicFilter;
} & DataviewFiltersProps;

export type ColumnFilterOption = {
    key: string;
    enabled: boolean;
    type: string;
}

export type GroupFilterComponentProps = {
    group: FilterGroup;
    recursiveIndex: number[];
    level: number;
    table: Table<RowDataType>;
    possibleColumns: ColumnFilterOption[];
};

/***************************************
 *         FILTERS  MODAL
 ***************************************/

/** Filters Modal */
export type FiltersModalProps = {
    table: Table<RowDataType>,
    possibleColumns: ColumnFilterOption[]
}

export type FiltersModalHandlerResponse = {
    filtersModalManager: FiltersModalManager
} & BaseModalHandlerResponse;