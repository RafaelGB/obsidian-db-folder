import { EMITTERS_GROUPS } from "helpers/Constants";

export interface ViewEvents {
    showLaneForm: () => void;
    [EMITTERS_GROUPS.HOTKEY]: (commandId: string) => void;
    [EMITTERS_GROUPS.SHORTCUT]: (commandId: string) => void;
}