import { RowDataType, TableColumn } from "cdm/FolderModel";
import {
  obtainColumnsFromFolder,
  obtainMetadataColumns,
} from "components/Columns";
import { InputType } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import { adapterTFilesToRows, isDatabaseNote } from "helpers/VaultManagement";

import { TFile, Platform } from "obsidian";
import { createRoot } from "react-dom/client";
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
  /**
   * Unparse the database file, and return the resulting text.
   * @returns
   */
  getViewData(): string {
    return this.data;
  }

  setViewData(data: string): void {
    if (!isDatabaseNote(data)) {
      this.plugin.databaseFileModes[(this.leaf as any).id || this.file.path] =
        InputType.MARKDOWN;
      this.plugin.removeView(this);
      this.plugin.setMarkdownView(this.leaf, false);

      return;
    }

    this.plugin.addView(this);
  }

  get isPrimary(): boolean {
    return this.plugin.getStateManager(this.file)?.getAView() === this;
  }

  postRenderActions(): void {}

  initRootContainer(file: TFile) {
    this.tableContainer = this.contentEl.createDiv(
      Platform.isDesktop ? c("container") : c("container-mobile")
    );
    this.tableContainer.setAttribute("id", file.path);
    this.rootContainer = createRoot(this.tableContainer);
  }

  async onLoadFile(file: TFile) {
    try {
      this.initRootContainer(file);
      return await super.onLoadFile(file);
    } catch (e) {
      const stateManager = this.plugin.stateManagers.get(this.file);
      throw e;
    }
  }
}
