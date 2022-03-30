import {
    HoverParent,
    HoverPopover,
    Menu,
    TFile,
    TextFileView,
    WorkspaceLeaf,
} from 'obsidian';
import DBFolderPlugin from 'main';

export class TableView extends TextFileView implements HoverParent {
    plugin: DBFolderPlugin;
    hoverPopover: HoverPopover | null;
    actionButtons: Record<string, HTMLElement> = {};
  
    constructor(leaf: WorkspaceLeaf, plugin: DBFolderPlugin) {
      super(leaf);
    }

    async clear() {
      this.hoverPopover = null;
      this.actionButtons = {};
    }

    getViewData(): string{
        return 'data';
    }

    getViewType(): string {
        return 'type';
    }

    setViewData(data: string, clear: boolean): void{
        
    }
}