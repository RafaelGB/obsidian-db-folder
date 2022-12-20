import { EMITTERS_GROUPS } from "helpers/Constants";
import { TFile } from "obsidian";
export type UpdaterData = { op: string, file: TFile, isActive: boolean, oldPath?: string };

export interface ViewEvents {
    showLaneForm: () => void;
    [EMITTERS_GROUPS.HOTKEY]: (commandId: string) => void;
    [EMITTERS_GROUPS.SHORTCUT]: (commandId: string) => void;
    [EMITTERS_GROUPS.UPDATER]: (updater: UpdaterData) => void;
}