import { TableColumn, TableDataType } from "cdm/FolderModel";
import { SortedType } from "cdm/DatabaseModel";

export type HeaderActionResponse = {
    column: TableColumn,
    buttons: any[]
    initialState: TableDataType,
    hooks: {
        setSortBy: (sortedType: SortedType[]) => void,
        setExpanded: (expanded: boolean) => void,
    }
}

export interface HeaderAction {
    setNext(handler: HeaderAction): HeaderAction;
    handle(settingHandlerResponse: HeaderActionResponse): HeaderActionResponse;
}