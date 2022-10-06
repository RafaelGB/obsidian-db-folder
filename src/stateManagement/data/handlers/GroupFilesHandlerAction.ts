import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { destination_folder } from "helpers/FileManagement";
import { FileGroupingService } from "services/FileGroupingService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class GroupFilesHandlerAction extends AbstractTableAction<DataState> {
  handle(
    tableActionResponse: TableActionResponse<DataState>
  ): TableActionResponse<DataState> {
    const { set, implementation, view } = tableActionResponse;
    implementation.actions.groupFiles = async () => {
      const folderPath = destination_folder(view, view.diskConfig.yaml.config);
      const movedRows = await FileGroupingService.organizeNotesIntoSubfolders(
        folderPath,
        view.rows,
        view.diskConfig.yaml.config
      );
      await FileGroupingService.removeEmptyFolders(
         folderPath,
         view.diskConfig.yaml.config
      );
      const rowsMap = new Map(movedRows.map((row) => [row.__note__.filepath, row]));
      set((state) => {
        return {
          rows: state.rows.map((row) => {
            if (rowsMap.has(row.__note__.filepath)) {
              return rowsMap.get(row.__note__.filepath);
            }
            else return row;
          })
        };
      });
    };
    tableActionResponse.implementation = implementation;
    return this.goNext(tableActionResponse);
  }
}
