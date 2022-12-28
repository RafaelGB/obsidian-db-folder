import { DataObject, Literal, WrappedLiteral } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { DateTime } from "luxon";
import { parseLuxonDatetimeToString } from "helpers/LuxonHelper";
import { TypeParser } from "cdm/ServicesModel";
import stringifyReplacer from "./StringifyReplacer";

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
                    return parseLuxonDatetimeToString(wrapped.value, this.config.datetime_format);
                }

                if (DataviewService.getDataviewAPI().isDataArray(wrapped.value)) {
                    return this.parseArrayToText(
                        (wrapped.value.values as Literal[])
                    );
                }
                try {
                    // Try to parse to JSON
                    return JSON.stringify(wrapped.value, stringifyReplacer);
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
        const stringArray = array.reduce((acc, curr) => {
            return acc.toString()
                .concat(",")
                .concat(
                    this
                        .parse(DataviewService.wrapLiteral(curr))
                        .toString()
                );
        });
        return `[${stringArray}]`;
    }
}

export default TextParser;