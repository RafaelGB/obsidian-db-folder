import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractChain, AbstractHandler } from "patterns/AbstractFactoryChain";
import CheckboxTypeHandlerAction from "components/headerActions/handlers/types/CheckboxTypeHeaderAction";
import TextTypeHeaderAction from "components/headerActions/handlers/types/TextTypeHeaderAction";
import SelectTypeHeaderAction from "components/headerActions/handlers/types/SelectTypeHeaderAction";
import TagsTypeHeaderAction from "components/headerActions/handlers/types/TagsTypeHeaderAction";
import NumberTypeHeaderAction from "components/headerActions/handlers/types/NumberTypeHeaderAction";
import DateTypeHeaderAction from "components/headerActions/handlers/types/DateTypeHeaderAction";
import DatetimeTypeHeaderAction from "components/headerActions/handlers/types/DatetimeTypeHeaderAction";
class HeaderActionTypesSection extends AbstractChain<HeaderActionResponse> {
    protected getHandlers(): AbstractHandler<HeaderActionResponse>[] {
        return [
            new TextTypeHeaderAction(),
            new NumberTypeHeaderAction(),
            new SelectTypeHeaderAction(),
            new TagsTypeHeaderAction(),
            new CheckboxTypeHandlerAction(),
            new DateTypeHeaderAction(),
            new DatetimeTypeHeaderAction(),
        ];
    }
}

const header_action_types_section = new HeaderActionTypesSection();
export default header_action_types_section;