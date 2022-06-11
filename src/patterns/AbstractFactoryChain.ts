export interface AbstractHandler<T> {
    setNext(handler: AbstractHandler<T>): AbstractHandler<T>;
    handle(abstractResponse: T): T;
}

export abstract class AbstractChain<T> {
    public run(abstractResponse: T): T {
        // Handler custom logic of the chain response
        abstractResponse = this.customHandle(abstractResponse);
        // Obtain the group of handlers
        const handlers = this.getHandlers();
        let i = 1;
        while (i < handlers.length) {
            handlers[i - 1].setNext(handlers[i]);
            i++;
        }
        // Run the chain
        return handlers[0]?.handle(abstractResponse);
    }
    protected abstract customHandle(abstractResponse: T): T;
    protected abstract getHandlers(): AbstractHandler<T>[];
}