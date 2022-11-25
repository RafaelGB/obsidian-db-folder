import React, { useEffect } from "react";
import { TableActionProps } from "cdm/MenuBarModel";
import { t } from "lang/helpers";

export default function SearchBarAction(actionProps: TableActionProps) {
  const { table } = actionProps;
  const { tableState, view } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);
  const configActions = tableState.configState((state) => state.actions);

  const handleGlobalSearchDisplay = (e: MouseEvent) => {
    configActions.alterEphimeral({
      enable_navbar: !configInfo.getEphimeralSettings().enable_navbar,
    });
  };

  useEffect(() => {
    if (!view.actionButtons["search"]) {
      const searchElement = view.addAction(
        "search",
        t("toolbar_menu_search_bar"),
        handleGlobalSearchDisplay,
        3
      );
      view.actionButtons.search = searchElement;
    }
  }, []);

  return <></>;
}
