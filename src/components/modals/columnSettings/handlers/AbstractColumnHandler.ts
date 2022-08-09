import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";

export interface ColumnHandler {
    setNext(handler: ColumnHandler): ColumnHandler;
    handle(settingHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse;
}

export abstract class AbstractColumnHandler implements ColumnHandler {
    abstract settingTitle: string;
    protected nextHandler: ColumnHandler;


    public goNext(settingHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(settingHandlerResponse);
        }
        return settingHandlerResponse;
    }

    public setNext(handler: ColumnHandler): ColumnHandler {
        this.nextHandler = handler;
        return handler;
    }


    abstract handle(settingHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse;
}
