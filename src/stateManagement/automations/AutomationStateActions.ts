import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractChain } from "patterns/AbstractFactoryChain";
import { AbstractHandler } from "patterns/AbstractHandler";
import GetFormulaHandlerAction from "stateManagement/automations/handlers/GetFormulaHandlerAction";
import LoadFormulasHandlerAction from "stateManagement/automations/handlers/LoadFormulasHandlerAction";
import RunFormulaHandlerAction from "stateManagement/automations/handlers/RunFormulaHandlerAction";
import DispatchRollupHandlerAction from "stateManagement/automations/handlers/DispatchRollupHandlerAction";
class AutomationStateActions extends AbstractChain<TableActionResponse<AutomationState>> {
    protected getHandlers(): AbstractHandler<TableActionResponse<AutomationState>>[] {
        return [
            new GetFormulaHandlerAction(),
            new LoadFormulasHandlerAction(),
            new RunFormulaHandlerAction(),
            new DispatchRollupHandlerAction()
        ];
    }
}

const automation_state_actions = new AutomationStateActions();
export default automation_state_actions;