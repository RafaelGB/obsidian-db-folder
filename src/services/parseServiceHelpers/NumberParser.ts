import { TypeParser } from "cdm/ServicesModel";
import { WrappedLiteral } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";

class NumberParser extends TypeParser<number> {
    parse(wrapped: WrappedLiteral): number {
        if (wrapped.type === 'number') {
            return wrapped.value;
        } else {
            const adjustedValue = DataviewService.getDataviewAPI().value.toString(wrapped.value);
            return Number(adjustedValue);
        }
    }
}

export default NumberParser;