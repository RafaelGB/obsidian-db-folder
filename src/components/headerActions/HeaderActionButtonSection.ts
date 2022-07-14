import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractChain, AbstractHandler } from "patterns/AbstractFactoryChain";
import SortHandlerAction from "components/headerActions/handlers/buttons/SortHandlerAction";
import AddColumnHandlerAction from "components/headerActions/handlers/buttons/AddColumnHandlerAction";
import RemoveColumnHandlerAction from "components/headerActions/handlers/buttons/RemoveColumnHandlerAction";

class HeaderActionButtonSection extends AbstractChain<HeaderActionResponse> {

    protected getHandlers(): AbstractHandler<HeaderActionResponse>[] {
        return [
            new SortHandlerAction(),
            new AddColumnHandlerAction(),
            new RemoveColumnHandlerAction()
        ];
    }
}

const header_action_button_section = new HeaderActionButtonSection();
export default header_action_button_section;