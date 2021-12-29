import {BaseError} from 'errors/BaseError';

/**
 * Custom error for parser yaml of dbfolder
 */
export class ParserError extends BaseError {
    errorsList: [string, string][];
    constructor(message: string, public errors: [string, string][]) {
        super(message+'\n'+errors.map(e => e[0]+': '+e[1]).join('\n'));
        this.errorsList = errors;
        Object.setPrototypeOf(this, ParserError.prototype);
    }

}