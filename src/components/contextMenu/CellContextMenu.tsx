import { CellContext } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { showFileMenu } from "components/obsidianArq/commands";
import Relationship from "components/RelationShip";
import { StyleVariables } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import { Literal } from "obsidian-dataview";
import React from "react";
import KeyboardControlKeyIcon from "@mui/icons-material/KeyboardControlKey";

export default function CellContextMenu(
  context: CellContext<RowDataType, Literal>
) {
  const { row, table } = context;
  const { tableState } = table.options.meta;
  const rowActions = tableState.data((state) => state.actions);

  /**
   * Handle left click
   * @param event
   */
  const handleClick = async () => {
    row.toggleExpanded(!row.getIsExpanded());
  };

  /**
   * Handle right click
   * @param event
   */
  const handlerContextMenu = async (event: React.MouseEvent<HTMLElement>) => {
    showFileMenu(
      row.original.__note__.getFile(),
      event.nativeEvent,
      row,
      rowActions
    );
  };

  const index = table.getRowModel().flatRows.indexOf(row) + 1;

  return (
    <>
      <div
        onClick={handleClick}
        onContextMenu={handlerContextMenu}
        key={`row-context-button-${index}`}
        className={c(`cell-context-button`)}
      >
        {row.getIsExpanded() ? (
          <KeyboardControlKeyIcon
            sx={{
              fontSize: "1.5rem",
            }}
          />
        ) : (
          <Relationship
            value={index}
            backgroundColor={StyleVariables.BACKGROUND_PRIMARY}
          />
        )}
      </div>
    </>
  );
}
