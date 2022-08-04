import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractChain, AbstractHandler } from "patterns/AbstractFactoryChain";
import DeleteColumnHandlerAction from "stateManagement/columns/handlers/DeleteColumnAction";
import InsertColumnHandlerAction from "stateManagement/columns/handlers/NewColumnAction";
import AlterSortingColumnHandlerAction from "stateManagement/columns/handlers/AlterSortingColumnAction";
class ColumnsStateActions extends AbstractChain<TableActionResponse<ColumnsState>> {
    protected getHandlers(): AbstractHandler<TableActionResponse<ColumnsState>>[] {
        return [
            new InsertColumnHandlerAction(),
            new DeleteColumnHandlerAction(),
            new AlterSortingColumnHandlerAction()
        ];
    }
}

const column_state_actions = new ColumnsStateActions();
export default column_state_actions;