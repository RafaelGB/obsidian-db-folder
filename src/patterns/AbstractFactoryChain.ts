export interface AbstractHandler<T> {
    setNext(handler: AbstractHandler<T>): AbstractHandler<T>;
    handle(abstractResponse: T): T;
}

export abstract class AbstractChain<T> {
    /**
     * Implement this method to customize the chain response before the handlers are run
     * @param abstractResponse 
     * @returns 
     */
    protected runBefore(abstractResponse: T): T {
        return abstractResponse;
    }
    protected customHandle(abstractResponse: T): T {
        return abstractResponse;
    }

    public run(abstractResponse: T): T {
        abstractResponse = this.runBefore(abstractResponse);
        // Obtain the group of handlers
        const handlers = this.getHandlers();
        if (handlers.length > 0) {
            // Handler custom logic of the chain response
            abstractResponse = this.customHandle(abstractResponse);

            let i = 1;
            while (i < handlers.length) {
                handlers[i - 1].setNext(handlers[i]);
                i++;
            }
        }
        // Run the chain
        return handlers[0]?.handle(abstractResponse);
    }
    protected abstract getHandlers(): AbstractHandler<T>[];
}