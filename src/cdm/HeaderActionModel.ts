import { SortedType } from "cdm/DatabaseModel";
import { ColumnWidthState } from "cdm/StyleModel";
import { HeaderMenuProps } from "cdm/HeaderModel";

export type HeaderActionResponse = {
    buttons: any[]
    headerMenuProps: HeaderMenuProps
    hooks: {
        setSortBy: (sortedType: SortedType[]) => void,
        setExpanded: (expanded: boolean) => void,
        setColumnWidthState: (a: ColumnWidthState) => void,
        columnWidthState: ColumnWidthState
    }
}

export interface HeaderAction {
    setNext(handler: HeaderAction): HeaderAction;
    handle(settingHandlerResponse: HeaderActionResponse): HeaderActionResponse;
}