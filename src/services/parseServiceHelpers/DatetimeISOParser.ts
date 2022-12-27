import { TypeParser } from "cdm/ServicesModel";
import { WrappedLiteral } from "obsidian-dataview";
import { DateTime } from "luxon";
class DatetimeISOParser extends TypeParser<DateTime> {
    parse(wrapped: WrappedLiteral) {
        if (wrapped.type === 'string') {
            const calendarCandidate = DateTime.fromISO(wrapped.value);

            if (calendarCandidate.isValid) {
                return calendarCandidate;
            }
            return null;
        }

        if (DateTime.isDateTime(wrapped.value)) {
            return wrapped.value;
        } else {
            return null;
        }
    }
}

export default DatetimeISOParser;