import React, { useEffect } from "react";
import { TableActionProps } from "cdm/MenuBarModel";
import { EMITTERS_GROUPS, EMITTERS_SHORTCUT } from "helpers/Constants";

export default function ShortcutsAction(actionProps: TableActionProps) {
  const { table } = actionProps;
  const { view } = table.options.meta;

  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    // NEXT PAGE
    const goNextPage = (e: string) => {
      if (e === EMITTERS_SHORTCUT.GO_NEXT_PAGE) {
        table.getCanNextPage() && table.nextPage();
      }
    };
    view.emitter.on(EMITTERS_GROUPS.SHORTCUT, goNextPage);

    // PREVIOUS PAGE
    const goPreviousPage = (e: string) => {
      if (e === EMITTERS_SHORTCUT.GO_PREVIOUS_PAGE) {
        table.getCanPreviousPage() && table.previousPage();
      }
    };
    view.emitter.on(EMITTERS_GROUPS.SHORTCUT, goPreviousPage);
    return () => {
      view.emitter.off(EMITTERS_GROUPS.SHORTCUT, goNextPage);
      view.emitter.off(EMITTERS_GROUPS.SHORTCUT, goPreviousPage);
    };
  }, []);
  return <></>;
}
