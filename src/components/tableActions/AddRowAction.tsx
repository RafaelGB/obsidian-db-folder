import React, { useEffect } from "react";
import { TableActionProps } from "cdm/MenuBarModel";
import { EMITTERS_GROUPS, EMITTERS_SHORTCUT } from "helpers/Constants";
import { t } from "lang/helpers";
import { AddRowModal } from "components/modals/addRow/AddRowModal";
import { AddRowModalProps } from "cdm/ModalsModel";

export default function AddRowAction(actionProps: TableActionProps) {
  const { table } = actionProps;
  const { view, tableState } = table.options.meta;

  const dataActions = tableState.data((state) => state.actions);
  const configInfo = tableState.configState((state) => state.info);
  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    const handleAddRow = (e?: MouseEvent) => {
      const props: AddRowModalProps = {
        dataState: {
          actions: dataActions,
        },
        view,
        ddbbConfig: configInfo.getLocalSettings(),
      };
      new AddRowModal(props).open();
    };
    if (!view.actionButtons.addRow) {
      const exportElement = view.addAction(
        "plus",
        t("toolbar_menu_add_row"),
        handleAddRow
      );
      view.actionButtons.addRow = exportElement;
    }
  }, []);
  return <></>;
}
