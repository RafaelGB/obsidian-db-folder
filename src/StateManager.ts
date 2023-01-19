import { DatabaseSettings } from "cdm/SettingsModel";
import { DatabaseView } from "views/DatabaseView";
import { TFile } from 'obsidian';
import { CustomView } from "views/AbstractView";
export default class StateManager {
  private onEmpty: () => void;
  private getGlobalSettings: () => DatabaseSettings;
  private viewSet: Set<CustomView> = new Set();
  public file: TFile;
  constructor(
    initialView: CustomView,
    onEmpty: () => void,
    getGlobalSettings: () => DatabaseSettings
  ) {
    this.file = initialView.file;
    this.onEmpty = onEmpty;
    this.getGlobalSettings = getGlobalSettings;

    this.registerView(initialView);
  }

  registerView(view: CustomView) {
    if (!this.viewSet.has(view)) {
      this.viewSet.add(view);
      view.initDatabase();
    }
  }

  unregisterView(view: CustomView) {
    if (this.viewSet.has(view)) {
      this.viewSet.delete(view);

      if (this.viewSet.size === 0) {
        this.onEmpty();
      }
    }
  }

  getAView(): CustomView {
    return this.viewSet.values().next().value;
  }

  async forceRefresh() {
    this.viewSet.forEach((view) => {
      view.reloadDatabase();
    });
  }
}