import { DataObject, Literal, WrappedLiteral } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { DateTime } from "luxon";
import { TypeParser } from "cdm/ServicesModel";
import stringifyReplacer from "./StringifyReplacer";
import * as YAML from 'yaml';
import { Db } from "services/CoreService";

class TextParser extends TypeParser<string | DataObject> {
    /**
     * Exposed method to parse a wrapped literal to text or data object
     * @param wrapped 
     * @returns 
     */
    public parse(wrapped: WrappedLiteral) {
        switch (wrapped.type) {
            case 'object':
                if (DateTime.isDateTime(wrapped.value)) {
                    return Db.coreFns.luxon.dateToString(wrapped.value, this.config.datetime_format);
                }

                if (DataviewService.getDataviewAPI().isDataArray(wrapped.value)) {
                    return this.parseArrayToText(
                        (wrapped.value.values as Literal[])
                    );
                }
                try {
                    // Try to parse to JSON
                    const jsonReplaced = JSON.stringify(wrapped.value, stringifyReplacer);
                    return YAML.stringify(JSON.parse(jsonReplaced));
                } catch (e) {
                    // Do nothing
                }
                // nested metadata exposed as DataObject
                return wrapped.value;

            case 'array':
                return this.parseArrayToText(wrapped.value);

            case 'link':
                return wrapped.value.markdown();
            // Else go to default
            default:
                return DataviewService.getDataviewAPI().value.toString(wrapped.value);
        }
    }

    private parseArrayToText(array: Literal[]): string {
        array = array.map((item) => this.parse(DataviewService.wrapLiteral(item)));
        return `[${array.join(",")}]`;
    }
}

export default TextParser;