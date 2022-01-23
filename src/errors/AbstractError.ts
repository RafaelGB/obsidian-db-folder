import { Notice, Component } from "obsidian";

export class DbFolderError extends Error{

    protected errorType: ErrorImplementation;

    constructor(error: ErrorImplementation) {
        super(error.getMessage());
        this.errorType = error;
        Object.setPrototypeOf(this, DbFolderError.prototype);
    }

    public render(component: Component): void {
        new Notice(this.errorType.getMessage());
    }
}

export interface ErrorImplementation {
    getMessage(): string;
}