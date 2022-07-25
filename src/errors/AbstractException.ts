import { Notice } from "obsidian";
import { generateErrorComponent } from "components/ErrorComponents"
import ReactDOM from 'react-dom';

export abstract class DbFolderException extends Error {
    protected messageErrors: Record<string, string[]> = {};

    constructor(message: string, errors: Record<string, string[]>) {
        super(message);
        if (Object.keys(errors).length > 0) {
            this.messageErrors = errors;
        }
        Object.setPrototypeOf(this, DbFolderException.prototype);
    }

    /**
     * Get the error message iterating over recordError
     */
    public getMessage(): string {
        return this.message + '\n' + Object.keys(this.messageErrors).map(e => e + ': ' + this.messageErrors[e].join('\n')).join('\n')
    }

    public render(container: HTMLElement): void {
        new Notice(this.getMessage());

        const errorContainer = container.createDiv("dbfolder-error-container");
        const errorComponent = generateErrorComponent(this.messageErrors);
        ReactDOM.render(errorComponent, errorContainer);
    }
}