import { HeaderAction, HeaderActionResponse } from "cdm/HeaderActionModel";

export abstract class AbstractColumnHandler implements HeaderAction {
    protected nextHandler: HeaderAction;

    public goNext(settingHandlerResponse: HeaderActionResponse): HeaderActionResponse {
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(settingHandlerResponse);
        }
        return settingHandlerResponse;
    }

    public setNext(handler: HeaderAction): HeaderAction {
        this.nextHandler = handler;
        return handler;
    }


    abstract handle(settingHandlerResponse: HeaderActionResponse): HeaderActionResponse;
}
