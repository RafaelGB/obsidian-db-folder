import { LocalSettings } from "cdm/SettingsModel"
import { InputType } from "helpers/Constants"
import ArrayParser from "./ArrayParser"
import BooleanParser from "./BooleanParser"
import CalendarParser from "./CalendarParser"
import DatetimeISOParser from "./DatetimeISOParser"
import EmptyParser from "./EmptyParser"
import LinksParser from "./LinksParser"
import MarkdownParser from "./MarkdownParser"
import NumberParser from "./NumberParser"
import SelectParser from "./SelectParser"
import SortingParser from "./SortingParser"
import TextParser from "./TextParser"

class ParseBuilder {
    static setType = (type: string, config: LocalSettings, isInline: boolean, wrapQuotes: boolean) => {
        switch (type) {
            case InputType.MARKDOWN:
                return new MarkdownParser().beforeParse(wrapQuotes, isInline);
            case InputType.SORTING:
                return new SortingParser();
            case InputType.TAGS:
                return new ArrayParser();
            case InputType.CALENDAR:
                return new CalendarParser().beforeParse(config.date_format);
            case InputType.CALENDAR_TIME:
                return new CalendarParser().beforeParse(config.datetime_format);
            case InputType.METATADA_TIME:
                return new DatetimeISOParser()
            case InputType.NUMBER:
                return new NumberParser();
            case InputType.CHECKBOX:
                return new BooleanParser();
            case InputType.RELATION:
                return new LinksParser();
            case InputType.SELECT:
                return new SelectParser().setConfig(config);
            case InputType.TASK:
            case InputType.FORMULA:
            case InputType.ROLLUP:
            case InputType.INLINKS:
            case InputType.OUTLINKS:
                return new EmptyParser();
            default:
                return new TextParser().setConfig(config);
        }
    }
}

export default ParseBuilder