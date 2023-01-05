import { EMITTERS_GROUPS } from "helpers/Constants";
import { TFile } from "obsidian";
export type UpdaterData = { op: string, file: TFile, isActive: boolean, oldPath?: string };

export type ContextMenuAction = "default" | "select";
export type ContextHeaderData = { action: ContextMenuAction, option?: string };
export interface ViewEvents {
    showLaneForm: () => void;
    [EMITTERS_GROUPS.HOTKEY]: (commandId: string) => void;
    [EMITTERS_GROUPS.SHORTCUT]: (commandId: string) => void;
    [EMITTERS_GROUPS.UPDATER]: (updater: UpdaterData) => void;
    [EMITTERS_GROUPS.BAR_STATUS]: (commandId: string) => void;
    [EMITTERS_GROUPS.CONTEXT_HEADER]: (data: ContextHeaderData) => void;
}