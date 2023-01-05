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
        switch (wrapped.type) {
            case 'boolean':
            case 'number':
                return wrapped.value.toString();
            case 'array':
                if (DataviewService.isSTaskArray(wrapped.value)) {
                    return wrapped.value.reduce((acc, curr) => {
                        if (!curr.completed) {
                            acc += 1;
                        }
                        return acc
                    }, 0);
                }
                return wrapped.value
                    .map(
                        v => this.parse(
                            DataviewService.wrapLiteral(v),
                        )
                    ).join(', ');
            case 'link':
                return wrapped.value.markdown();
            case 'date':
                if (wrapped.value.hour === 0 && wrapped.value.minute === 0 && wrapped.value.second === 0) {
                    // Parse date
                    return parseLuxonDatetimeToString(wrapped.value, this.config.date_format);
                } else {
                    // Parse datetime
                    return parseLuxonDateToString(wrapped.value, this.config.datetime_format);
                }
            case 'object':
                if (DateTime.isDateTime(wrapped.value)) {
                    return this.parse({ type: 'date', value: wrapped.value });
                }

                if (DataviewService.isStasks(wrapped.value)) {
                    return wrapped.value.completed ? '0' : '1';
                }

                return JSON.stringify(wrapped.value);
            default:
                return wrapped.value?.toString().trim();
        }
    }


}

export default SortingParser;