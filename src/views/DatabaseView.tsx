import { RowDataType, TableColumn } from "cdm/FolderModel";
import {
  obtainColumnsFromFolder,
  obtainMetadataColumns,
} from "components/Columns";
import { adapterTFilesToRows } from "helpers/VaultManagement";
import { CustomView } from "./AbstractView";

export class DatabaseView extends CustomView {
  async getRows(): Promise<RowDataType[]> {
    return await adapterTFilesToRows(
      this.file,
      this.columns,
      this.diskConfig.yaml.config,
      this.diskConfig.yaml.filters
    );
  }

  async getColumns(): Promise<TableColumn[]> {
    // Complete the columns with the metadata columns
    const yamlColumns = await obtainMetadataColumns(
      this.diskConfig.yaml.columns,
      this.diskConfig.yaml.config
    );
    // Obtain base information about columns
    return await obtainColumnsFromFolder(yamlColumns);
  }
}
