export class HistoryQueue {
    constructor(private undoQueue: string[] = [], private redoQueue: string[] = []) {
    }

    /**
     * Add item to undo queue
     * 
     * @param item
     */
    public pushUndo(item: string) {
        this.undoQueue.push(item);
    }

    /**
     * Undo the last action
     * 
     * @returns
     */
    public popUndo(): string | undefined {
        const item = this.undoQueue.pop();
        if (item) {
            this.redoQueue.push(item);
        }
        return item;
    }

    /**
     * Redo the last action
     * 
     * @returns
     */
    public popRedo(): string | undefined {
        const item = this.redoQueue.pop();
        if (item) {
            this.undoQueue.push(item);
        }
        return item;
    }
}