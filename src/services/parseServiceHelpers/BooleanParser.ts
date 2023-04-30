import { TypeParser } from "cdm/ServicesModel";
import { WrappedLiteral } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";

class BooleanParser extends TypeParser<boolean> {
    parse(wrapped: WrappedLiteral) {
        switch (wrapped.type) {
            case "boolean":
                return wrapped.value;
            case "number":
                return wrapped.value !== 0;
            default:
                return DataviewService.getDataviewAPI().value.toString(wrapped.value) === "true";

        }
    }
}

export default BooleanParser;