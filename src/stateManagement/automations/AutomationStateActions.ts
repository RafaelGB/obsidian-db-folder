import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractChain } from "patterns/AbstractFactoryChain";
import { AbstractHandler } from "patterns/AbstractHandler";
import GetFormulaHandlerAction from "stateManagement/automations/handlers/GetFormulaHandlerAction";
import LoadFormulasHandlerAction from "stateManagement/automations/handlers/LoadFormulasHandlerAction";
class AutomationStateActions extends AbstractChain<TableActionResponse<AutomationState>> {
    protected getHandlers(): AbstractHandler<TableActionResponse<AutomationState>>[] {
        return [
            new GetFormulaHandlerAction(),
            new LoadFormulasHandlerAction()
        ];
    }
}

const automation_state_actions = new AutomationStateActions();
export default automation_state_actions;