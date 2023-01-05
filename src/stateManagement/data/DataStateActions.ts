import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractChain } from "patterns/chain/AbstractFactoryChain";
import AddRowlHandlerAction from "stateManagement/data/handlers/AddRowHandlerAction";
import UpdateCellHandlerAction from "stateManagement/data/handlers/UpdateCellHandlerAction";
import UpdateDataAfterLabelChangeHandlerAction from "stateManagement/data/handlers/UpdateDataAfterLabelChangeHandlerAction";
import RemoveRowHandlerAction from "stateManagement/data/handlers/RemoveRowHandlerAction";
import RemoveDataOfColumnHandlerAction from "stateManagement/data/handlers/RemoveDataOfColumnHandlerAction";
import ParseDataOfColumnHandlerAction from "stateManagement/data/handlers/ParseDataOfColumnHandlerAction";
import DataviewRefreshHandlerAction from "stateManagement/data/handlers/DataviewRefreshHandlerAction";
import RemoveOptionForAllRowsAction from "stateManagement/data/handlers/RemoveOptionForAllRowsAction";
import RenameFileHandlerAction from "stateManagement/data/handlers/RenameFileHandlerAction";
import SaveDataFromFileHandlerAction from "stateManagement/data/handlers/SaveDataFromFileHandlerAction";
import GroupFilesHandlerAction from "stateManagement/data/handlers/GroupFilesHandlerAction";
import EditOptionForAllRowsHandlerAction from "stateManagement/data/handlers/EditOptionForAllRowsHandlerAction";
import DataviewUpdaterHandlerAction from "stateManagement/data/handlers/DataviewUpdaterHandlerAction";
import { AbstractHandler } from "patterns/chain/AbstractHandler";

class DataStateActions extends AbstractChain<TableActionResponse<DataState>> {
  protected getHandlers(): AbstractHandler<TableActionResponse<DataState>>[] {
    return [
      new AddRowlHandlerAction(),
      new UpdateCellHandlerAction(),
      new ParseDataOfColumnHandlerAction(),
      new UpdateDataAfterLabelChangeHandlerAction(),
      new RemoveRowHandlerAction(),
      new RemoveDataOfColumnHandlerAction(),
      new DataviewRefreshHandlerAction(),
      new DataviewUpdaterHandlerAction(),
      new EditOptionForAllRowsHandlerAction(),
      new RemoveOptionForAllRowsAction(),
      new RenameFileHandlerAction(),
      new SaveDataFromFileHandlerAction(),
      new GroupFilesHandlerAction()
    ];
  }
}

const data_state_actions = new DataStateActions();
export default data_state_actions;
