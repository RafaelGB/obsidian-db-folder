import { DbFolderException } from 'errors/AbstractException';

/**
 * Custom error for parser yaml of dbfolder
 */
export class ParserException extends DbFolderException {
    constructor(message: string, public errors: Record<string, string[]>) {
        super(message, errors);
    }
}

