import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractChain } from "patterns/AbstractFactoryChain";
import AddRowlHandlerAction from "stateManagement/data/handlers/AddRowHandlerAction";
import UpdateCellHandlerAction from "stateManagement/data/handlers/UpdateCellHandlerAction";
import UpdateDataAfterLabelChangeHandlerAction from "stateManagement/data/handlers/UpdateDataAfterLabelChangeHandlerAction";
import RemoveRowHandlerAction from "stateManagement/data/handlers/RemoveRowHandlerAction";
import RemoveDataOfColumnHandlerAction from "stateManagement/data/handlers/RemoveDataOfColumnHandlerAction";
import ParseDataOfColumnHandlerAction from "stateManagement/data/handlers/ParseDataOfColumnHandlerAction";
import { AbstractHandler } from "patterns/AbstractHandler";

class DataStateActions extends AbstractChain<TableActionResponse<DataState>> {
    protected getHandlers(): AbstractHandler<TableActionResponse<DataState>>[] {
        return [
            new AddRowlHandlerAction(),
            new UpdateCellHandlerAction(),
            new ParseDataOfColumnHandlerAction(),
            new UpdateDataAfterLabelChangeHandlerAction(),
            new RemoveRowHandlerAction(),
            new RemoveDataOfColumnHandlerAction()
        ];
    }
}

const data_state_actions = new DataStateActions();
export default data_state_actions;