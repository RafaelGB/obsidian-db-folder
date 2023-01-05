import { ContextHeaderData, ViewEvents } from "cdm/EmitterModel";
import { ContextMenuAction, EMITTERS_GROUPS } from "helpers/Constants";
import { Emitter } from "helpers/Emitter";
import { Menu } from "obsidian";

export default function showHeaderContextMenu(event: MouseEvent, currentState: ContextHeaderData, emitter: Emitter<ViewEvents>) {
    const contextMenu = new Menu();
    // Options of current action
    switch (currentState.action) {
        case ContextMenuAction.SELECT:
            contextMenu.addItem((item) => item
                .setTitle("Remove selected rows")
                .setIcon("checkmark")
                .onClick(() => {
                    emitter.emit(EMITTERS_GROUPS.CONTEXT_HEADER, { action: ContextMenuAction.SELECT, option: "remove" });
                }));

            contextMenu.addItem((item) => item
                .setTitle("Duplicate selected rows")
                .setIcon("checkmark")
                .onClick(() => {
                    emitter.emit(EMITTERS_GROUPS.CONTEXT_HEADER, { action: ContextMenuAction.SELECT, option: "duplicate" });
                }));
            break;
        default:
        // Do nothing
    }
    // Actions
    contextMenu.addSeparator();
    const setAction = (data: ContextHeaderData) => {
        emitter.emit(EMITTERS_GROUPS.CONTEXT_HEADER, data);
    };

    if (currentState.action !== ContextMenuAction.DEFAULT) {
        contextMenu.addItem((item) => item
            .setTitle("Column Search")
            .setIcon("search")
            .onClick(() => {
                setAction({ action: ContextMenuAction.DEFAULT });
            }));
    }

    if (currentState.action !== ContextMenuAction.SELECT) {
        contextMenu.addItem((item) => item
            .setTitle("Bulk actions (rows)")
            .setIcon("vertical-three-dots")
            .onClick(() => {
                setAction({ action: ContextMenuAction.SELECT });
            }));
    }
    contextMenu.showAtMouseEvent(event);
}