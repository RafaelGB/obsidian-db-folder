import { DatabaseView } from "DatabaseView";
import { SettingsManager } from "Settings";

export interface SettingHandler {
    setNext(handler: SettingHandler): SettingHandler;
    handle(settingHandlerResponse:SettingHandlerResponse): SettingHandlerResponse;
}

export type SettingHandlerResponse = {
    settingsManager: SettingsManager, 
    containerEl: HTMLElement,
    local: boolean,
    listOfErrors: [string, string][],
    view?: DatabaseView,
}

export abstract class AbstractSettingsHandler implements SettingHandler {
    abstract settingTitle: string;
    protected nextHandler: SettingHandler;
    protected listOfErrors: [string,string][] = [];

    protected addError(error: string): void {
        this.listOfErrors.push([this.settingTitle, error]);
    }
    
    protected goNext(): SettingHandler {
        if (this.nextHandler) {
            return this.nextHandler;
        }
        return this;
    }

    public setNext(handler: SettingHandler): SettingHandler {
        this.nextHandler = handler;
        return handler;
    }


    abstract handle(settingHandlerResponse:SettingHandlerResponse): SettingHandlerResponse;
}