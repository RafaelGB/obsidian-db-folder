import React, { useEffect } from "react";
import { TableActionProps } from "cdm/MenuBarModel";
import { t } from "lang/helpers";
import { LOGGER } from "services/Logger";
import { EMITTERS_GROUPS, EMITTERS_SHORTCUT } from "helpers/Constants";

export default function HistoryActions(actionProps: TableActionProps) {
  const { table } = actionProps;
  const { tableState, view } = table.options.meta;

  const handleUndo = (e: MouseEvent) => {
    // TODO
    const action = view.history.popUndo();
    LOGGER.warn("Undo not implemented yet: action {}", action);
  };

  const handleRedo = (e: MouseEvent) => {
    // TODO
    const action = view.history.popRedo();
    LOGGER.warn("Redo not implemented yet: action {}", action);
  };

  useEffect(() => {
    if (!view.actionButtons.undo) {
      const importElement = view.addAction(
        "undo-glyph",
        t("toolbar_menu_undo"),
        handleUndo
      );
      view.actionButtons.undo = importElement;
    }
    if (!view.actionButtons.redo) {
      const importElement = view.addAction(
        "redo-glyph",
        t("toolbar_menu_redo"),
        handleRedo
      );
      view.actionButtons.redo = importElement;
    }

    const onUndoShortcut = (e: string) => {
      if (e === EMITTERS_SHORTCUT.UNDO) {
        LOGGER.warn("Undo not implemented yet");
      }
    };
    view.emitter.on(EMITTERS_GROUPS.SHORTCUT, onUndoShortcut);

    const onRedoShortcut = (e: string) => {
      if (e === EMITTERS_SHORTCUT.REDO) {
        LOGGER.warn("Redo not implemented yet");
      }
    };
    view.emitter.on(EMITTERS_GROUPS.SHORTCUT, onRedoShortcut);
    return () => {
      view.emitter.off(EMITTERS_GROUPS.SHORTCUT, onRedoShortcut);
      view.emitter.off(EMITTERS_GROUPS.SHORTCUT, onUndoShortcut);
    };
  }, []);

  return <></>;
}
