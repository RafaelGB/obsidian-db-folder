import { DatabaseSettings } from "cdm/SettingsModel";
import { DatabaseView } from "DatabaseView";
import { TFile } from 'obsidian';
export default class StateManager {
  private onEmpty: () => void;
  private getGlobalSettings: () => DatabaseSettings;
  private viewSet: Set<DatabaseView> = new Set();
  public file: TFile;
  constructor(
    initialView: DatabaseView,
    onEmpty: () => void,
    getGlobalSettings: () => DatabaseSettings
  ) {
    this.file = initialView.file;
    this.onEmpty = onEmpty;
    this.getGlobalSettings = getGlobalSettings;

    this.registerView(initialView);
  }

  registerView(view: DatabaseView) {
    this.viewSet.clear();
    this.viewSet.add(view);
    view.initDatabase();

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