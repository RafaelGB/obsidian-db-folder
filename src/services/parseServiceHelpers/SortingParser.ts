import { TypeParser } from "cdm/ServicesModel";
import { Literal, WrappedLiteral } from "obsidian-dataview";
import { DateTime } from "luxon";
import { DataviewService } from "services/DataviewService";
import { parseLuxonDatetimeToString, parseLuxonDateToString } from "helpers/LuxonHelper";

class SortingParser extends TypeParser<Literal> {
    parse(wrapped: WrappedLiteral) {
        let auxMarkdown = '';
        switch (wrapped.type) {
            case 'link':
                auxMarkdown = wrapped.value.fileName();
                break;
            case 'object':
            case 'date':
                if (DateTime.isDateTime(wrapped.value)) {
                    auxMarkdown = wrapped.value.toMillis().toString();
                } else {
                    auxMarkdown = JSON.stringify(wrapped.value);
                }
                break;
            // By default. Use markdown parser
            default:
                auxMarkdown = this.parseToPlainText(wrapped).toString();
        }
        return auxMarkdown;
    }

    private parseToPlainText(wrapped: WrappedLiteral) {
        let plainText: string;
        switch (wrapped.type) {
            case 'boolean':
            case 'number':
                plainText = wrapped.value.toString();
                break;
            case 'array':
                plainText = wrapped.value
                    .map(
                        v => this.parse(
                            DataviewService.wrapLiteral(v),
                        )
                    ).join(', ');
                break;
            case 'link':
                plainText = wrapped.value.markdown();
                break;
            case 'date':
                if (wrapped.value.hour === 0 && wrapped.value.minute === 0 && wrapped.value.second === 0) {
                    // Parse date

                    plainText = parseLuxonDatetimeToString(wrapped.value, this.config.date_format);
                } else {
                    // Parse datetime
                    plainText = parseLuxonDateToString(wrapped.value, this.config.datetime_format);
                }
                break;
            case 'object':
                if (DateTime.isDateTime(wrapped.value)) {
                    plainText = this.parse({ type: 'date', value: wrapped.value });
                } else {
                    plainText = JSON.stringify(wrapped.value);
                }
                break;
            default:
                plainText = wrapped.value?.toString().trim();
        }

        return plainText;
    }
}

export default SortingParser;