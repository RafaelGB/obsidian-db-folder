import { DbFolderException } from 'errors/AbstractException';

/**
 * Custom error for parser yaml of dbfolder
 */
export class HelperError extends DbFolderException {
    constructor(message: string) {
        super(message, {});
    }
}