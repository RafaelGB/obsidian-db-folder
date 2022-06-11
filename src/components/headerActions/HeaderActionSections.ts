import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractChain, AbstractHandler } from "patterns/AbstractFactoryChain";
import SortHandlerAction from "components/headerActions/handlers/buttons/SortHandlerAction";
import AddColumnHandlerAction from "components/headerActions/handlers/buttons/AddColumnHandlerAction";

class HeaderActionButtonSection extends AbstractChain<HeaderActionResponse> {

    protected customHandle(abstractResponse: HeaderActionResponse): HeaderActionResponse {
        return abstractResponse;
    }

    protected getHandlers(): AbstractHandler<HeaderActionResponse>[] {
        return [
            new SortHandlerAction(),
            new AddColumnHandlerAction()
        ];
    }
}

const header_action_button_section = new HeaderActionButtonSection();
export default header_action_button_section;