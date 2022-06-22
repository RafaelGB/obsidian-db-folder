import { DbFolderError } from 'errors/AbstractError';

/**
 * Custom error for parser yaml of dbfolder
 */
export class HelperError extends DbFolderError {
    constructor(message: string) {
        super(message, {});
    }
}