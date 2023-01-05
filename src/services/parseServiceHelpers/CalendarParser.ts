import { TypeParser } from "cdm/ServicesModel";
import { WrappedLiteral } from "obsidian-dataview";
import { DateTime } from "luxon";
import { Db } from "services/CoreService";

class CalendarParser extends TypeParser<DateTime> {
    private dateFormat: string;

    public beforeParse(format: string) {
        this.dateFormat = format;
        return this;
    }

    parse(wrapped: WrappedLiteral) {
        if (wrapped.type === 'string') {
            return Db.coreFns.luxon.stringToDate(wrapped.value, this.dateFormat);
        }

        if (DateTime.isDateTime(wrapped.value)) {
            return wrapped.value;
        } else {
            return null;
        }
    }
}

export default CalendarParser;