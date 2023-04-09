import { InputType } from "helpers/Constants";

export default class ReactTableMapper {
    public static inputTypeToFilterKey(inputType: string): string {
        let filterKey: string;
        switch (inputType) {
            case InputType.MARKDOWN:
                filterKey = 'markdown';
                break;
            case InputType.OUTLINKS:
            case InputType.INLINKS:
            case InputType.RELATION:
                filterKey = 'linksGroup';
                break;
            case InputType.CALENDAR:
            case InputType.CALENDAR_TIME:
            case InputType.METATADA_TIME:
                filterKey = 'calendar';
                break;
            case InputType.CHECKBOX:
                filterKey = 'boolean';
                break;
            case InputType.TAGS:
                filterKey = 'tags';
                break;
            case InputType.TASK:
                filterKey = 'task';
                break;
            case InputType.SELECT:
            case InputType.TEXT:
            case InputType.ROLLUP:
            case InputType.FORMULA:
                filterKey = 'plainText';
                break;
            case InputType.NUMBER:
                filterKey = 'number';
                break;
            default:
                filterKey = 'auto';
        }
        return filterKey;
    }
}