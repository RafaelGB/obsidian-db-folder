import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractChain, AbstractHandler } from "patterns/AbstractFactoryChain";
import CheckboxTypeHandlerAction from "components/headerActions/handlers/types/CheckboxTypeHeaderAction";
class HeaderActionTypesSection extends AbstractChain<HeaderActionResponse> {
    protected customHandle(abstractResponse: HeaderActionResponse): HeaderActionResponse {
        return abstractResponse;
    }

    protected getHandlers(): AbstractHandler<HeaderActionResponse>[] {
        return [
            new CheckboxTypeHandlerAction()
        ];
    }
}

const header_action_types_section = new HeaderActionTypesSection();
export default header_action_types_section;