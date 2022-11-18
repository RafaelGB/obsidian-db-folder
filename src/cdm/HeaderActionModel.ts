import { HeaderMenuProps } from "cdm/HeaderModel";

export type HeaderActionResponse = {
    buttons: JSX.Element[]
    headerMenuProps: HeaderMenuProps
    hooks: {
        setMenuEl: (expanded: null | HTMLElement) => void,
        setTypesEl: (expanded: null | HTMLElement) => void,
        setKeyState: (key: string) => void,
        keyState: string,
        [key: string]: any | ((a: any) => void)
    }
}

export type HeaderActionModel = {
    label: string;
    icon: React.ReactNode;
    onClick: (e: any) => Promise<void>;
};
export interface HeaderAction {
    setNext(handler: HeaderAction): HeaderAction;
    handle(settingHandlerResponse: HeaderActionResponse): HeaderActionResponse;
}