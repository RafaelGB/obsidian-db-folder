export interface AbstractHandler<T> {
    setNext(handler: AbstractHandler<T>): AbstractHandler<T>;
    handle(response: T): T;
}

export abstract class AbstractHandlerClass<T> implements AbstractHandler<T> {
    abstract settingTitle: string;
    protected nextHandler: AbstractHandler<T>;


    public goNext(response: T): T {
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(response);
        }
        return response;
    }

    public setNext(handler: AbstractHandler<T>): AbstractHandler<T> {
        this.nextHandler = handler;
        return handler;
    }


    abstract handle(settingHandlerResponse: T): T;
}
