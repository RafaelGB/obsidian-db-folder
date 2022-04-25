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
    errors: Record<string, string[]>,
    view?: DatabaseView,
}

export abstract class AbstractSettingsHandler implements SettingHandler {
    abstract settingTitle: string;
    protected nextHandler: SettingHandler;
    protected listOfErrors: string[] = [];

    protected addError(error: string): void {
        this.listOfErrors.push(error);
    }
    
    public goNext(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        // add possible errors to response
        if(this.listOfErrors.length > 0) {
            settingHandlerResponse.errors[this.settingTitle] = this.listOfErrors;
        }
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(settingHandlerResponse);
        }
        return settingHandlerResponse;
    }

    public setNext(handler: SettingHandler): SettingHandler {
        this.nextHandler = handler;
        return handler;
    }


    abstract handle(settingHandlerResponse:SettingHandlerResponse): SettingHandlerResponse;
}