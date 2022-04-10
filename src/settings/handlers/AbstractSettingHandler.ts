import DBFolderPlugin from "main";
import { SettingsManager } from "Settings";

export interface SettingHandler {
    setNext(handler: SettingHandler): SettingHandler;
    handle(settingsManager: SettingsManager,containerEl: HTMLElement, local: boolean): [string, string][];
}

export abstract class AbstractSettingsHandler implements SettingHandler {
    abstract settingTitle: string;
    protected nextHandler: SettingHandler;
    protected listOfErrors: [string,string][] = [];

    protected addError(error: string): void {
        this.listOfErrors.push([this.settingTitle, error]);
    }
    
    public setNext(handler: SettingHandler): SettingHandler {
        this.nextHandler = handler;
        return handler;
    }
    abstract handle(settingsManager: SettingsManager, containerEl: HTMLElement, local: boolean): [string, string][];
}