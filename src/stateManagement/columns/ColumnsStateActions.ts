import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractChain, AbstractHandler } from "patterns/AbstractFactoryChain";
import InsertColumnHandlerAction from "./handlers/NewColumnAction";
class ColumnsStateActions extends AbstractChain<TableActionResponse<ColumnsState>> {
    protected getHandlers(): AbstractHandler<TableActionResponse<ColumnsState>>[] {
        return [
            new InsertColumnHandlerAction(),
        ];
    }
}

const column_state_actions = new ColumnsStateActions();
export default column_state_actions;