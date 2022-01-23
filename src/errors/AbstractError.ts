import { Notice, Component } from "obsidian";
import { generateErrorComponent } from "components/ErrorComponents"
import ReactDOM from 'react-dom';

export class DbFolderError extends Error{

    protected errorType: ErrorImplementation;

    constructor(error: ErrorImplementation) {
        super(error.getMessage());
        this.errorType = error;
        Object.setPrototypeOf(this, DbFolderError.prototype);
    }

    public render(container: HTMLElement): void {
        new Notice(this.errorType.getMessage());

        const errorContainer  = container.createDiv("dbfolder-error-container");
        let errorComponent = generateErrorComponent(this.errorType.getMessage());
        ReactDOM.render(errorComponent, errorContainer);
    }
}

export interface ErrorImplementation {
    getMessage(): string;
}