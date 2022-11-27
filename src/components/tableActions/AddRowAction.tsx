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
  const configActions = tableState.configState((state) => state.actions);
  const columnsInfo = tableState.columns((state) => state.info);
  const templateOptions = tableState.rowTemplate((state) => state.options);
  const templateRow = tableState.rowTemplate((state) => state.template);
  const templateUpdate = tableState.rowTemplate((state) => state.update);
  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    // Open Add Row Modal
    const handleAddRow = (e?: MouseEvent) => {
      const props: AddRowModalProps = {
        dataState: {
          actions: dataActions,
        },
        columnsState: {
          info: columnsInfo,
        },
        rowTemplate: {
          options: templateOptions,
          template: templateRow,
          update: templateUpdate,
        },
        configState: {
          info: configInfo,
          actions: configActions,
        },
        view,
        table: table,
      };
      new AddRowModal(props).open();
    };
    // Manage bar action for add row
    if (!view.actionButtons.addRow) {
      const exportElement = view.addAction(
        "plus",
        t("toolbar_menu_add_row"),
        handleAddRow
      );
      view.actionButtons.addRow = exportElement;
    }
    // Manage Keyboard shortcut for add row
    const addRowShortcut = (e: string) => {
      if (e === EMITTERS_SHORTCUT.ADD_NEW_ROW) {
        handleAddRow();
      }
    };

    view.emitter.on(EMITTERS_GROUPS.SHORTCUT, addRowShortcut);

    return () => {
      view.emitter.off(EMITTERS_GROUPS.SHORTCUT, addRowShortcut);
    };
  }, []);
  return <></>;
}
