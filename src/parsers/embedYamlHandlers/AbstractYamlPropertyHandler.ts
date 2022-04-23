import { App } from "obsidian";

export interface YamlHandler {
    setNext(handler: YamlHandler): YamlHandler;

    handle(yaml: any): [string, string][];
}

export abstract class AbstractYamlHandler implements YamlHandler {
    abstract handlerName: string;

    protected nextHandler: YamlHandler;
    protected listOfErrors: [string,string][] = [];

    protected addError(error: string): void {
        this.listOfErrors.push([this.handlerName, error]);
    }
    
    public setNext(handler: YamlHandler): YamlHandler {
        this.nextHandler = handler;
        return handler;
    }
    abstract handle(yaml: any): [string, string][];
}