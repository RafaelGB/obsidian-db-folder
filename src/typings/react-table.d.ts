import { RankingInfo } from '@tanstack/match-sorter-utils';
import { FilterFn } from '@tanstack/react-table';
import '@tanstack/table-table';
import { RowDataType } from "cdm/FolderModel";
import { TableStateInterface } from "cdm/TableStateInterface";
import { CustomView } from 'views/AbstractView';

declare module '@tanstack/react-table' {
    // @ts-ignore
    interface TableMeta {
        tableState: TableStateInterface;
        view: CustomView;
    }

    interface FilterFns {
        [key: string]: FilterFn<RowDataType>
    }

    interface FilterMeta {
        itemRank: RankingInfo
    }

}