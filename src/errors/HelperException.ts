import { DbFolderException } from 'errors/AbstractException';

/**
 * Custom error for parser yaml of dbfolder
 */
export default class HelperException extends DbFolderException {
    constructor(message: string) {
        super(message, {});
    }
}
