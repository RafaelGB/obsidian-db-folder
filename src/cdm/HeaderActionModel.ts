import { SortedType } from "cdm/DatabaseModel";
import { HeaderMenuProps } from "cdm/HeaderModel";

export type HeaderActionResponse = {
    buttons: any[]
    headerMenuProps: HeaderMenuProps
    hooks: {
        setSortBy: (sortedType: SortedType[]) => void,
        setExpanded: (expanded: boolean) => void,
        setKeyState: (a: string) => void,
        keyState: string,
        [key: string]: any | ((a: any) => void)
    }
}

export interface HeaderAction {
    setNext(handler: HeaderAction): HeaderAction;
    handle(settingHandlerResponse: HeaderActionResponse): HeaderActionResponse;
}