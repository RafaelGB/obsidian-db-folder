import React, { useEffect } from "react";
import { TableActionProps } from "cdm/MenuBarModel";
import { t } from "lang/helpers";
import { EMITTERS_GROUPS, EMITTERS_HOTKEY } from "helpers/Constants";

export default function SearchBarAction(actionProps: TableActionProps) {
  const { table } = actionProps;
  const { tableState, view } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);
  const configActions = tableState.configState((state) => state.actions);

  useEffect(() => {
    // Manage Seach action
    const handleGlobalSearchDisplay = (e?: MouseEvent) => {
      configActions.alterEphimeral({
        enable_navbar: !configInfo.getEphimeralSettings().enable_navbar,
      });
    };
    if (!view.actionButtons["search"]) {
      const searchElement = view.addAction(
        "search",
        t("toolbar_menu_search_bar"),
        handleGlobalSearchDisplay,
        3
      );
      view.actionButtons.search = searchElement;
    }
    // Manage Keyboard shortcut for search
    const onSearchHotkey = (e: string) => {
      if (e === EMITTERS_HOTKEY.OPEN_SEARCH) {
        handleGlobalSearchDisplay();
      }
    };

    view.emitter.on(EMITTERS_GROUPS.HOTKEY, onSearchHotkey);

    return () => {
      view.emitter.off(EMITTERS_GROUPS.HOTKEY, onSearchHotkey);
    };
  }, []);
  return <></>;
}
