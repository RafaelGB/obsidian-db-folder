import { HeaderMenuProps } from "cdm/HeaderModel";

export type HeaderActionResponse = {
    buttons: any[]
    headerMenuProps: HeaderMenuProps
    hooks: {
        setExpanded: (expanded: boolean) => void,
        setKeyState: (key: string) => void,
        keyState: string,
        [key: string]: any | ((a: any) => void)
    }
}

export interface HeaderAction {
    setNext(handler: HeaderAction): HeaderAction;
    handle(settingHandlerResponse: HeaderActionResponse): HeaderActionResponse;
}