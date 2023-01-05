import { TypeParser } from "cdm/ServicesModel";
import { parseStringToLuxonDatetime } from "helpers/LuxonHelper";
import { WrappedLiteral } from "obsidian-dataview";
import { DateTime } from "luxon";

class CalendarParser extends TypeParser<DateTime> {
    private dateFormat: string;

    public beforeParse(format: string) {
        this.dateFormat = format;
        return this;
    }

    parse(wrapped: WrappedLiteral) {
        if (wrapped.type === 'string') {
            return parseStringToLuxonDatetime(wrapped.value, this.dateFormat);
        }

        if (DateTime.isDateTime(wrapped.value)) {
            return wrapped.value;
        } else {
            return null;
        }
    }
}

export default CalendarParser;