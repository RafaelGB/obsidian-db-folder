import {ErrorImplementation} from 'errors/AbstractError';

/**
 * Custom error for parser yaml of dbfolder
 */
export class ParserError implements ErrorImplementation {
    message: string;
    errorsList: [string, string][];

    constructor(message: string, public errors: [string, string][]) {
        this.message = message;
        this.errorsList = errors;
    }

    public getErrorsList(): [string, string][] {
        return this.errorsList;
    }

    public getMessage(): string {
        return this.message+'\n'+this.errorsList.map(e => e[0]+': '+e[1]).join('\n')
    }
}

