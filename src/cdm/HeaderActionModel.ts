import { TableColumn } from "cdm/FolderModel";

export type HeaderActionResponse = {
    column: TableColumn
}

export interface HeaderAction {
    setNext(handler: HeaderAction): HeaderAction;
    handle(settingHandlerResponse: HeaderActionResponse): HeaderActionResponse;
}