import { RowDataType, TableColumn } from "cdm/FolderModel";
import {
  obtainColumnsFromFolder,
  obtainMetadataColumns,
} from "components/Columns";
import obtainInitialType from "helpers/InitialType";
import { adapterTFilesToRows } from "helpers/VaultManagement";
import { Db } from "services/CoreService";
import { CustomView } from "./AbstractView";

export class DatabaseView extends CustomView {
  async getColumns(): Promise<TableColumn[]> {
    // Complete the columns with the metadata columns
    const yamlColumns = await obtainMetadataColumns(
      this.diskConfig.yaml.columns,
      this.diskConfig.yaml.config
    );
    // Obtain base information about columns
    return await obtainColumnsFromFolder(yamlColumns);
  }

  async getRows(): Promise<RowDataType[]> {
    return await adapterTFilesToRows(
      this.file,
      this.columns,
      this.diskConfig.yaml.config,
      this.diskConfig.yaml.filters
    );
  }

  getInitialType() {
    return obtainInitialType(this.columns);
  }

  async getFormulas() {
    return await Db.buildFns(this.diskConfig.yaml.config);
  }
}
