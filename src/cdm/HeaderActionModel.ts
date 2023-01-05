import { HeaderMenuProps } from "cdm/HeaderModel";

export type HeaderActionResponse = {
    buttons: JSX.Element[]
    headerMenuProps: HeaderMenuProps
    hooks: {
        setMenuEl: (expanded: null | HTMLElement) => void,
        setTypesEl: (expanded: null | HTMLElement) => void,
        setKeyState: (key: string) => void,
        keyState: string,
        [key: string]: unknown | ((a: unknown) => void)
    }
}

export type HeaderActionModel = {
    label: string;
    icon: React.ReactNode;
    onClick: (e: unknown) => Promise<void>;
};
export interface HeaderAction {
    setNext(handler: HeaderAction): HeaderAction;
    handle(settingHandlerResponse: HeaderActionResponse): HeaderActionResponse;
}