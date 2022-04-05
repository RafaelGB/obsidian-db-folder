import { App } from "obsidian";

export interface Handler {
    setNext(handler: Handler): Handler;

    handle(yaml: any, app: App): [string, string][];
}

export abstract class AbstractHandler implements Handler {
    abstract handlerName: string;

    protected nextHandler: Handler;
    protected listOfErrors: [string,string][] = [];

    protected addError(error: string): void {
        this.listOfErrors.push([this.handlerName, error]);
    }
    
    public setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        return handler;
    }
    abstract handle(yaml: any, app: App): [string, string][];
}