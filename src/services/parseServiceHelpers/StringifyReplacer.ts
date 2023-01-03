import { Literal } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";

/**
 * Custom replacer for JSON.stringify to handle DB Folder types
 * @param key 
 * @param value 
 * @returns 
 */
const stringifyReplacer = (key: string, value: Literal) => {
    const wrappedLiteral = DataviewService.wrapLiteral(value);
    switch (wrappedLiteral.type) {
        case 'link':
            return wrappedLiteral.value.markdown();
        default:
            return value;
    }
};

export default stringifyReplacer;