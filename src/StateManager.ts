import { DatabaseView } from "DatabaseView";
import { App, TFile, moment } from 'obsidian';
import { DatabaseSettings } from 'Settings';
export class StateManager {
    private app: App;
    private file: TFile;
    private onEmpty: () => void;
    private getGlobalSettings: () => DatabaseSettings;
    //private parser: BaseFormat;
    private viewSet: Set<DatabaseView> = new Set();

    constructor(
        app: App,
        initialView: DatabaseView,
        initialData: string,
        onEmpty: () => void,
        getGlobalSettings: () => DatabaseSettings
      ) {
        this.app = app;
        this.file = initialView.file;
        this.onEmpty = onEmpty;
        this.getGlobalSettings = getGlobalSettings;
        //this.parser = new ListFormat(this);
    
        this.registerView(initialView, initialData, true);
      }

      registerView(view: DatabaseView, data: string, shouldParseData: boolean) {
        if (!this.viewSet.has(view)) {
          this.viewSet.add(view);
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
}