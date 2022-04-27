import { ErrorImplementation } from 'errors/AbstractError';

/**
 * Custom error for parser yaml of dbfolder
 */
export class ParserError implements ErrorImplementation {
    message: string;
    recordError: Record<string, string[]>;

    constructor(message: string, public errors: Record<string, string[]>) {
        this.message = message;
        this.recordError = errors;
    }

    public getErrorsList(): Record<string, string[]> {
        return this.recordError;
    }

    /**
     * Get the error message iterating over recordError
     */
    public getMessage(): string {
        return this.message + '\n' + Object.keys(this.recordError).map(e => e + ': ' + this.recordError[e].join('\n')).join('\n')
    }
}

