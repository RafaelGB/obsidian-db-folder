export interface Handler {
    setNext(handler: Handler): Handler;

    handle(yaml: any): boolean;
}

export abstract class AbstractHandler implements Handler {
    private nextHandler: Handler;

    public setNext(handler: Handler): Handler {
        this.nextHandler = handler;

        return handler;
    }

    public handle(yaml: any): boolean {
        if (this.nextHandler) {
            return this.nextHandler.handle(yaml);
        }

        return true;
    }
}