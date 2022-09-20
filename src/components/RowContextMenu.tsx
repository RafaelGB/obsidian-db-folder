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
  cell: ({ row, table }) => {
    const { tableState } = table.options.meta;
    const rowActions = tableState.data((state) => state.actions);
    const handleDeleteRow = () => {
      rowActions.removeRow(row.original);
    };

    const handleRenameRow = () => {
      rowActions.renameFile(row.index);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
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
          key={`row-context-button-${index}`}
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Relationship
            value={index}
            backgroundColor={StyleVariables.BACKGROUND_PRIMARY}
          />
        </div>
      </>
    );
  },
};
export default rowContextMenuColumn;
