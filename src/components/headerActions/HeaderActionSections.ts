import { HeaderAction, HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractChain, AbstractHandler } from "patterns/AbstractFactoryChain";
import { SortHandlerAction } from "components/headerActions/handlers/buttons/SortHandlerAction";

class HeaderActionButtonSection extends AbstractChain<HeaderActionResponse> {

    protected customHandle(abstractResponse: HeaderActionResponse): HeaderActionResponse {
        return abstractResponse;
    }

    protected getHandlers(): AbstractHandler<HeaderActionResponse>[] {
        return [
            new SortHandlerAction()
        ];
    }
}

const header_action_button_section = new HeaderActionButtonSection();
export default header_action_button_section;