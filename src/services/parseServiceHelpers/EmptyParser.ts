import { TypeParser } from "cdm/ServicesModel";
import { Literal } from "obsidian-dataview";

class EmptyParser extends TypeParser<Literal> {
}

export default EmptyParser;