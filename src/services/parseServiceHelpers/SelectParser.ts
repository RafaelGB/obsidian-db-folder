import { TypeParser } from "cdm/ServicesModel";
import { satinizedColumnOption } from "helpers/FileManagement";
import { Literal, WrappedLiteral } from "obsidian-dataview";
import { DateTime } from "luxon";
import { DataviewService } from "services/DataviewService";
import { Db } from "services/CoreService";

class SelectParser extends TypeParser<string> {
    /**
     * Exposed method to parse a wrapped literal to select string
     * @param wrapped 
     * @returns 
     */
    public parse(wrapped: WrappedLiteral) {
        let parsedValue: string;
        switch (wrapped.type) {
            case 'object':
                if (DateTime.isDateTime(wrapped.value)) {
                    parsedValue = Db.coreFns.luxon.dateToString(wrapped.value, this.config.datetime_format);
                } else if (DataviewService.isDataArray(wrapped.value)) {
                    parsedValue = this.parseArrayToText(
                        (wrapped.value.values as Literal[])
                    );
                } else {
                    try {
                        // Try to parse to JSON
                        parsedValue = JSON.stringify(wrapped.value);
                    } catch (e) {
                        parsedValue = wrapped.value.toString();
                    }
                }
                break;
            case 'array':
                parsedValue = this.parseArrayToText(wrapped.value);
                break;
            case 'link':
                parsedValue = wrapped.value.markdown();
                break;
            // Else go to default
            default:
                parsedValue = DataviewService.getDataviewAPI().value.toString(wrapped.value);
        }
        return satinizedColumnOption(parsedValue);
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
        }, "");
        return `[${stringArray}]`;
    }
}

export default SelectParser;