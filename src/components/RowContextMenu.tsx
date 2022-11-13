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
import LinkIcon from "@mui/icons-material/Link";

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
    const [isHovering, setIsHovering] = React.useState(false);
    const rowActions = tableState.data((state) => state.actions);
    const handleDeleteRow = () => {
      rowActions.removeRow(row.original);
    };

    const handleRenameRow = () => {
      rowActions.renameFile(row.index);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      // Handle right click
      if (event.type === "contextmenu") {
        showFileMenu(
          row.original.__note__.getFile(),
          event.nativeEvent,
          handleDeleteRow,
          handleRenameRow
        );
      }
      // Handle left click
      else if (event.type === "click") {
        app.workspace.getLeaf().openFile(row.original.__note__.getFile());
      }
    };
    const index = Number(row.index) + 1;
    return (
      <>
        <div
          onClick={handleClick}
          onContextMenu={handleClick}
          onMouseOver={() => setIsHovering(true)}
          onMouseOut={() => setTimeout(() => setIsHovering(false), 150)}
          key={`row-context-button-${index}`}
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            height: "5px",
            width: "20px",
          }}
        >
          {isHovering ? (
            <LinkIcon style={{ color: StyleVariables.LINK_COLOR }} />
          ) : (
            <Relationship
              value={index}
              backgroundColor={StyleVariables.BACKGROUND_PRIMARY}
            />
          )}
        </div>
      </>
    );
  },
};
export default rowContextMenuColumn;
