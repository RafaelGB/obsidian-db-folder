import { DbFolderError } from 'errors/AbstractError';

/**
 * Custom error for parser yaml of dbfolder
 */
export class ParserError extends DbFolderError {
    constructor(message: string, public errors: Record<string, string[]>) {
        super(message, errors);
    }
}

