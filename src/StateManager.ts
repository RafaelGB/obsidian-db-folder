import { DatabaseSettings } from "cdm/SettingsModel";
import { TableStateInterface } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import { App, TFile } from 'obsidian';
import useRowTemplateStore from "stateManagement/useRowTemplateStore";
export default class StateManager {
  private onEmpty: () => void;
  private getGlobalSettings: () => DatabaseSettings;
  private viewSet: Set<DatabaseView> = new Set();
  public file: TFile;
  constructor(
    initialView: DatabaseView,
    initialData: string,
    onEmpty: () => void,
    getGlobalSettings: () => DatabaseSettings
  ) {
    this.file = initialView.file;
    this.onEmpty = onEmpty;
    this.getGlobalSettings = getGlobalSettings;

    this.registerView(initialView, initialData, true);
  }

  registerView(view: DatabaseView, data: string, shouldParseData: boolean) {
    if (!this.viewSet.has(view)) {
      this.viewSet.add(view);
      view.initDatabase();
    }
  }

  unregisterView(view: DatabaseView) {
    if (this.viewSet.has(view)) {
      this.viewSet.delete(view);

      if (this.viewSet.size === 0) {
        this.onEmpty();
      }
    }
  }

  getAView(): DatabaseView {
    return this.viewSet.values().next().value;
  }

  async forceRefresh() {
    this.viewSet.forEach((view) => {
      view.reloadDatabase();
    });
  }
}