import { DbFolderException } from 'errors/AbstractException';

/**
 * Custom error for parser yaml of dbfolder
 */
export default class ParserException extends DbFolderException {
    constructor(message: string, public errors: Record<string, string[]>) {
        super(message, errors);
    }
}

