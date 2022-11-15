import { TableColumn } from "cdm/FolderModel";
import {
  DEFAULT_COLUMN_CONFIG,
  InputType,
  MetadataDatabaseColumns,
  StyleVariables,
} from "helpers/Constants";
import React from "react";
import { showFileMenu } from "components/obsidianArq/commands";
import Relationship from "components/RelationShip";

const rowContextMenuColumn: TableColumn = {
  ...MetadataDatabaseColumns.ROW_CONTEXT_MENU,
  input: InputType.TEXT,
  config: DEFAULT_COLUMN_CONFIG,
  position: 0,
  header: () => null,
  width: 30,
  maxSize: 30,
  cell: ({ row, table }) => {
    const { tableState } = table.options.meta;
    const rowActions = tableState.data((state) => state.actions);
    const handleDeleteRow = () => {
      rowActions.removeRow(row.original);
    };

    const handleRenameRow = () => {
      rowActions.renameFile(row.index);
    };

    /**
     * Handle left click
     * @param event
     */
    const handleClick = async () => {
      await app.workspace.getLeaf().openFile(row.original.__note__.getFile());
    };

    /**
     * Handle right click
     * @param event
     */
    const handlerContextMenu = async (event: React.MouseEvent<HTMLElement>) => {
      showFileMenu(
        row.original.__note__.getFile(),
        event.nativeEvent,
        handleDeleteRow,
        handleRenameRow
      );
    };

    const index = Number(row.index) + 1;

    return (
      <>
        <div
          onClick={handleClick}
          onContextMenu={handlerContextMenu}
          key={`row-context-button-${index}`}
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            margin: "0",
          }}
        >
          {
            <Relationship
              value={index}
              backgroundColor={StyleVariables.BACKGROUND_PRIMARY}
            />
          }
        </div>
      </>
    );
  },
};
export default rowContextMenuColumn;
