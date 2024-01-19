import { TypeParser } from "cdm/ServicesModel";
import { Link, WrappedLiteral } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";

class LinksParser extends TypeParser<Link[]> {
    parse(wrapped: WrappedLiteral) {
        // If is a link, return it into an array
        if (wrapped.type === 'link') {
            return [wrapped.value];
        }
        // If is an array of links, return it
        if (wrapped.type === 'array') {
            const filteredLinks = wrapped.value.filter((value: any) => {
                const wrappedValue = DataviewService.wrapLiteral(value);
                return wrappedValue.type === 'link';
            });
            return filteredLinks as Link[];
        }
        // If is something else, return empty array
        return [];
    }
}

export default LinksParser;