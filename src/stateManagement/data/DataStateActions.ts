import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractChain } from "patterns/chain/AbstractFactoryChain";
import AddRowlHandlerAction from "./handlers/AddRowHandlerAction";
import UpdateCellHandlerAction from "./handlers/UpdateCellHandlerAction";
import UpdateDataAfterLabelChangeHandlerAction from "./handlers/UpdateDataAfterLabelChangeHandlerAction";
import RemoveRowHandlerAction from "./handlers/RemoveRowHandlerAction";
import RemoveDataOfColumnHandlerAction from "./handlers/RemoveDataOfColumnHandlerAction";
import ParseDataOfColumnHandlerAction from "./handlers/ParseDataOfColumnHandlerAction";
import DataviewRefreshHandlerAction from "./handlers/DataviewRefreshHandlerAction";
import RemoveOptionForAllRowsAction from "./handlers/RemoveOptionForAllRowsAction";
import RenameFileHandlerAction from "./handlers/RenameFileHandlerAction";
import ImportRowsFromCSVHandlerAction from "./handlers/ImportRowsFromCSVHandlerAction";
import GroupFilesHandlerAction from "./handlers/GroupFilesHandlerAction";
import EditOptionForAllRowsHandlerAction from "./handlers/EditOptionForAllRowsHandlerAction";
import DataviewUpdaterHandlerAction from "./handlers/DataviewUpdaterHandlerAction";
import BulkRowUpdateHandlerAction from "./handlers/BulkRowUpdateHandlerAction";
import InfoDataFunctions from "./handlers/InfoDataFunctions";
import UpdateBidirectionalRelation from "./handlers/UpdateBidirectionalRelation";
import { AbstractHandler } from "patterns/chain/AbstractHandler";

class DataStateActions extends AbstractChain<TableActionResponse<DataState>> {
  protected getHandlers(): AbstractHandler<TableActionResponse<DataState>>[] {
    return [
      new AddRowlHandlerAction(),
      new UpdateCellHandlerAction(),
      new ParseDataOfColumnHandlerAction(),
      new UpdateDataAfterLabelChangeHandlerAction(),
      new UpdateBidirectionalRelation(),
      new RemoveRowHandlerAction(),
      new RemoveDataOfColumnHandlerAction(),
      new DataviewRefreshHandlerAction(),
      new DataviewUpdaterHandlerAction(),
      new EditOptionForAllRowsHandlerAction(),
      new RemoveOptionForAllRowsAction(),
      new RenameFileHandlerAction(),
      new ImportRowsFromCSVHandlerAction(),
      new GroupFilesHandlerAction(),
      new BulkRowUpdateHandlerAction(),
      new InfoDataFunctions()
    ];
  }
}

const data_state_actions = new DataStateActions();
export default data_state_actions;
