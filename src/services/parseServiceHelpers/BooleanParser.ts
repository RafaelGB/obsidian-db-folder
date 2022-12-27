import { TypeParser } from "cdm/ServicesModel";
import { WrappedLiteral } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";

class BooleanParser extends TypeParser<boolean> {
    parse(wrapped: WrappedLiteral) {
        if (wrapped.type === 'boolean') {
            return wrapped.value;
        } else {
            const adjustedValue = DataviewService.getDataviewAPI().value.toString(wrapped.value);
            return adjustedValue === 'true';
        }
    }
}

export default BooleanParser;