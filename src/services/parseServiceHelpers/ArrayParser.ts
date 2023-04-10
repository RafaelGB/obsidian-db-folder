import { TypeParser } from "cdm/ServicesModel";
import { satinizedColumnOption } from "helpers/FileManagement";
import { WrappedLiteral } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";

class ArrayParser extends TypeParser<string[] | string> {
    parse(wrapped: WrappedLiteral) {
        if (wrapped.value === "") {
            return wrapped.value;
        }

        if (wrapped.type !== 'array') {
            return wrapped.value.toString().split(",").map(s => satinizedColumnOption(s.toString().trim()));
        }
        return wrapped.value.map(v => satinizedColumnOption(DataviewService.getDataviewAPI().value.toString(v)));
    }
}

export default ArrayParser;