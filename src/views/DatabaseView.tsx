import { RowDataType, TableColumn } from "cdm/FolderModel";
import {
  obtainColumnsFromFolder,
  obtainMetadataColumns,
} from "components/Columns";
import { OptionSource } from "helpers/Constants";
import obtainInitialType from "helpers/InitialType";
import { adapterTFilesToRows } from "helpers/VaultManagement";
import { Db } from "services/CoreService";
import { FormulaService } from "services/FormulaService";
import { LOGGER } from "services/Logger";
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

  async preActions() {
    // Nothing to do
  }

  async postActions() {
    // Automatically update formula options
    this.columns.forEach(async (column) => {
      const { config } = column;
      if (config.option_source === OptionSource.FORMULA) {
        LOGGER.info(`Updating options for column ${column.id}`);
        const updatedOptions = FormulaService.evalOptionsWith(
          column,
          this.formulas
        );

        await this.diskConfig.updateColumnProperties(column.id, {
          options: updatedOptions,
        });
      }
    });
  }
}
