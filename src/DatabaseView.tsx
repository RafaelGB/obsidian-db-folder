import { TableDataType } from 'cdm/FolderModel';
import { obtainColumnsFromFolder, addMandatoryColumns} from 'components/Columns';
import { createDatabase } from 'components/index/Database';
import { adapterTFilesToRows, obtainContentFromTfile } from 'helpers/VaultManagement';
import DBFolderPlugin from 'main';

import {
    HoverParent,
    HoverPopover,
    TextFileView,
    WorkspaceLeaf,
    TFile,
    Menu
  } from 'obsidian';
import { frontMatterKey, getDatabaseconfigYaml, hasFrontmatterKey } from 'parsers/DatabaseParser';
import * as React from "react";
import ReactDOM from 'react-dom';
import { LOGGER } from 'services/Logger';
import { SettingsModal } from 'Settings';
import { StateManager } from 'StateManager';
export const databaseIcon = 'blocks';

export class DatabaseView extends TextFileView implements HoverParent {
    plugin: DBFolderPlugin;
    hoverPopover: HoverPopover | null;
    actionButtons: Record<string, HTMLElement> = {};
    
    constructor(leaf: WorkspaceLeaf, plugin: DBFolderPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    /**
     * Unparse the database file, and return the resulting text.
     * @returns 
     */
    getViewData(): string {
        return this.data;
    }

    setViewData(data: string, clear: boolean): void {
        if (!hasFrontmatterKey(data)) {
            this.plugin.databaseFileModes[(this.leaf as any).id || this.file.path] =
              'markdown';
            this.plugin.removeView(this);
            this.plugin.setMarkdownView(this.leaf, false);
      
            return;
          }
      
          this.plugin.addView(this, data, !clear && this.isPrimary);
    }

    getViewType(): string {
        return frontMatterKey;
    }

    getStateManager(): StateManager {
        return this.plugin.getStateManager(this.file);
    }
    get id(): string {
        // TODO define id on workfleaf
        return `${(this.leaf as any).id}:::${this.file?.path}`;
    }

    get isPrimary(): boolean {
        return this.plugin.getStateManager(this.file)?.getAView() === this;
    }

    onMoreOptionsMenu(menu: Menu) {
      // Add a menu item to force the database to markdown view
      menu
        .addItem((item) => {
          item
            .setTitle('Open as markdown')
            .setIcon('document')
            .onClick(() => {
              this.plugin.databaseFileModes[
                (this.leaf as any).id || this.file.path
              ] = 'markdown';
              this.plugin.setMarkdownView(this.leaf);
            });
        })
        .addItem((item) => {
          item
            .setTitle('Open database settings')
            .setIcon('gear')
            .onClick(() => {
              new SettingsModal(
                this,
                {
                  onSettingsChange: (settings) => {
                    
                    LOGGER.warn("TODO on settings change");
                    // Save to disk, compute text of new database
                  },
                },
                this.plugin.settings
              ).open();
            });
        })
        .addSeparator();
  
      super.onMoreOptionsMenu(menu);
    }

    async initDatabase(): Promise<void> {
      LOGGER.debug(`=>initDatabase ${this.file.path}`);
      const databaseRaw = await obtainContentFromTfile(this.file);
      const databaseConfigYaml = getDatabaseconfigYaml(databaseRaw);
      databaseConfigYaml.columns = addMandatoryColumns(databaseConfigYaml.columns);
      let columns = await obtainColumnsFromFolder(databaseConfigYaml.columns);
      let folder = this.file.path.split('/').slice(0, -1).join('/');
      let rows = await adapterTFilesToRows(folder);
      const tableProps:TableDataType = {
        columns: columns,
        data: rows,
        skipReset: false,
        view: this,
        stateManager: this.plugin.getStateManager(this.file)
      }
      let table = createDatabase(tableProps,this.app);
      const tableContainer  = this.contentEl.createDiv("dbfolder-table-container");
      ReactDOM.render(table, tableContainer);
      LOGGER.debug(`<=initDatabase ${this.file.path}`);
    }
    
    destroy() {
        // Remove draggables from render, as the DOM has already detached
        this.plugin.removeView(this);
    
        Object.values(this.actionButtons).forEach((b) => b.remove());
        this.actionButtons = {};
      }
    
      async onClose() {
        this.destroy();
      }
    
      async onUnloadFile(file: TFile) {
        this.destroy();
        return await super.onUnloadFile(file);
      }

    async onLoadFile(file: TFile) {
        try {
          return await super.onLoadFile(file);
        } catch (e) {
          const stateManager = this.plugin.stateManagers.get(this.file);    
          throw e;
        }
      }

    clear(): void {
        /*
        Obsidian *only* calls this after unloading a file, before loading the next.
        Specifically, from onUnloadFile, which calls save(true), and then optionally
        calls clear, if and only if this.file is still non-empty.  That means that
        in this function, this.file is still the *old* file, so we should not do
        anything here that might try to use the file (including its path), so we
        should avoid doing anything that refreshes the display.  (Since that could
        use the file, and would also flash an empty pane during navigation, depending
        on how long the next file load takes.)
        Given all that, it makes more sense to clean up our state from onLoadFile, as
        following a clear there are only two possible states: a successful onLoadFile
        updates our full state via setViewData(), or else it aborts with an error
        first.  So as long as setViewData() and the error handler for onLoadFile()
        fully reset the state (to a valid load state or a valid error state),
        there's nothing to do in this method.  (We can't omit it, since it's
        abstract.)
        */
    }
}