import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractChain } from "patterns/chain/AbstractFactoryChain";
import SortHandlerAction from "components/headerActions/handlers/buttons/SortHandlerAction";
import AddColumnHandlerAction from "components/headerActions/handlers/buttons/AddColumnHandlerAction";
import RemoveColumnHandlerAction from "components/headerActions/handlers/buttons/RemoveColumnHandlerAction";
import HideColumnHandlerAction from "components/headerActions/handlers/buttons/HideColumnHandlerAction";
import { AbstractHandler } from "patterns/chain/AbstractHandler";

class HeaderActionButtonSection extends AbstractChain<HeaderActionResponse> {

    protected getHandlers(): AbstractHandler<HeaderActionResponse>[] {
        return [
            new SortHandlerAction(),
            new AddColumnHandlerAction(),
            new HideColumnHandlerAction(),
            new RemoveColumnHandlerAction()
        ];
    }
}

const header_action_button_section = new HeaderActionButtonSection();
export default header_action_button_section;