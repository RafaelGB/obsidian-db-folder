import { DiskHandler, DiskHandlerResponse } from "cdm/MashallModel";


export abstract class AbstractDiskHandler implements DiskHandler {
    abstract handlerName: string;
    protected nextHandler: DiskHandler;
    protected listOfErrors: string[] = [];
    protected localDisk: string[] = [];

    protected addError(error: string): void {
        this.listOfErrors.push(error);
    }

    public setNext(handler: DiskHandler): DiskHandler {
        this.nextHandler = handler;
        return handler;
    }

    public goNext(diskHandlerResponse: DiskHandlerResponse): DiskHandlerResponse {
        // add possible errors to response
        if (this.listOfErrors.length > 0) {
            diskHandlerResponse.errors[this.handlerName] = this.listOfErrors;
        }
        // add local disk to response
        diskHandlerResponse.disk.push(...this.localDisk);
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(diskHandlerResponse);
        }
        return diskHandlerResponse;
    }
    abstract handle(yaml: DiskHandlerResponse): DiskHandlerResponse;
}