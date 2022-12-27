import { TypeParser } from "cdm/ServicesModel";
import { parseLuxonDatetimeToString, parseLuxonDateToString } from "helpers/LuxonHelper";
import { Literal, WrappedLiteral } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { DateTime } from "luxon";
import { MarkdownBreakerRules } from "helpers/Constants";

class MarkdownParser extends TypeParser<Literal> {
    private isInline = false;
    private wrapQuotes = false;

    beforeParse(wrapQuotes: boolean, isInline: boolean) {
        this.wrapQuotes = wrapQuotes;
        this.isInline = isInline;
        return this;
    }

    parse(wrapped: WrappedLiteral) {
        let auxMarkdown: Literal;
        switch (wrapped.type) {
            case 'boolean':
            case 'number':
                auxMarkdown = wrapped.value;
                break;
            case 'array':
                auxMarkdown = wrapped.value
                    .map(
                        v => this.parse(
                            DataviewService.wrapLiteral(v),
                        )
                    );
                if (this.isInline) {
                    auxMarkdown = auxMarkdown.join(', ');
                }
                break;
            case 'link':
                auxMarkdown = wrapped.value.markdown();
                break;
            case 'date':
                if (wrapped.value.hour === 0 && wrapped.value.minute === 0 && wrapped.value.second === 0) {
                    // Parse date

                    auxMarkdown = parseLuxonDatetimeToString(wrapped.value, this.config.date_format);
                } else {
                    // Parse datetime
                    auxMarkdown = parseLuxonDateToString(wrapped.value, this.config.datetime_format);
                }
                break;
            case 'object':
                if (DateTime.isDateTime(wrapped.value)) {
                    auxMarkdown = this.parse({ type: 'date', value: wrapped.value });
                } else {
                    auxMarkdown = JSON.stringify(wrapped.value);
                }
                break;
            default:
                auxMarkdown = wrapped.value?.toString().trim();
        }

        const wrappedResponse = DataviewService.wrapLiteral(auxMarkdown);
        if (wrappedResponse.type === 'string') {
            return this.wrapQuotes ? this.handleYamlBreaker(wrappedResponse.value) : wrappedResponse.value;
        } else {
            return wrappedResponse.value;
        }
    }

    private handleYamlBreaker(value: string): string {
        // Remove a possible already existing quote wrapper
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
            return this.wrapWithQuotes(value);
        }

        // Check possible markdown breakers of the yaml
        if (MarkdownBreakerRules.INIT_CHARS.some(c => value.startsWith(c)) ||
            MarkdownBreakerRules.BETWEEN_CHARS.some(rule => value.includes(rule)) ||
            MarkdownBreakerRules.UNIQUE_CHARS.some(c => value === c)) {
            return this.wrapWithQuotes(value);
        }
        return value;
    }

    private wrapWithQuotes(value: string): string {
        value = value.replaceAll(`\\`, ``);
        value = value.replaceAll(`"`, `\\"`);
        return `"${value}"`;
    }
}

export default MarkdownParser;