import { TableAction, TableActionResponse } from "cdm/TableStateInterface";

export abstract class AbstractTableAction<T> implements TableAction<T> {
    protected nextHandler: TableAction<T>;

    public goNext(settingHandlerResponse: TableActionResponse<T>): TableActionResponse<T> {
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(settingHandlerResponse);
        }
        return settingHandlerResponse;
    }

    public setNext(handler: TableAction<T>): TableAction<T> {
        this.nextHandler = handler;
        return handler;
    }


    abstract handle(settingHandlerResponse: TableActionResponse<T>): TableActionResponse<T>;
}