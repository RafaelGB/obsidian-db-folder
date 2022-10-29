import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractChain } from "patterns/AbstractFactoryChain";
import CheckboxTypeHandlerAction from "components/headerActions/handlers/types/CheckboxTypeHeaderAction";
import TextTypeHeaderAction from "components/headerActions/handlers/types/TextTypeHeaderAction";
import SelectTypeHeaderAction from "components/headerActions/handlers/types/SelectTypeHeaderAction";
import TagsTypeHeaderAction from "components/headerActions/handlers/types/TagsTypeHeaderAction";
import NumberTypeHeaderAction from "components/headerActions/handlers/types/NumberTypeHeaderAction";
import DateTypeHeaderAction from "components/headerActions/handlers/types/DateTypeHeaderAction";
import DatetimeTypeHeaderAction from "components/headerActions/handlers/types/DatetimeTypeHeaderAction";
import FormulaTypeHeaderAction from "components/headerActions/handlers/types/FormulaTypeHeaderAction";
import RelationTypeHeaderAction from "components/headerActions/handlers/types/RelationTypeHeaderAction";
import RollupTypeHeaderAction from "components/headerActions/handlers/types/RollupTypeHeaderAction";
import { AbstractHandler } from "patterns/AbstractHandler";

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
            new FormulaTypeHeaderAction(),
            new RelationTypeHeaderAction(),
            new RollupTypeHeaderAction(),
        ];
    }
}

const header_action_types_section = new HeaderActionTypesSection();
export default header_action_types_section;