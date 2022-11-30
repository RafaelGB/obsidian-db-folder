import { Notice } from "obsidian";
import { boundaryPreRendererComponent } from "components/ErrorComponents"
import { Root } from "react-dom/client";

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

    public render(boundary: Root): void {
        new Notice(this.getMessage());
        const errorComponent = boundaryPreRendererComponent(this.messageErrors);
        boundary.render(errorComponent);
    }
}