import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import { InputType } from "helpers/Constants";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { Notice } from "obsidian";
import { Link } from "obsidian-dataview";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { DataviewService } from "services/DataviewService";
import { ParseService } from "services/ParseService";
import RelationEditor from "components/cellTypes/Editor/RelationEditor";

const RelationCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { table, row, column } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const relationRow = tableState.data((state) => state.rows[row.index]);
  const dataActions = tableState.data((state) => state.actions);
  const configInfo = tableState.configState((state) => state.info);
  const columnsInfo = tableState.columns((state) => state.info);
  const relationCell = tableState.data(
    (state) =>
      ParseService.parseRowToCell(
        state.rows[row.index],
        tableColumn,
        InputType.RELATION,
        configInfo.getLocalSettings()
      ) as Link[]
  );

  const containerCellRef = useRef<HTMLDivElement>();
  const [dirtyCell, setDirtyCell] = useState(false);

  /**
   * Render markdown content of Obsidian on load
   */
  useEffect(() => {
    if (relationCell.length === 0 || dirtyCell) {
      // End useEffect
      return;
    }

    if (containerCellRef.current !== undefined) {
      containerCellRef.current.innerHTML = "";
      const mdRelations = relationCell
        .map((relation) => {
          return relation.markdown();
        })
        .join(", ");
      renderMarkdown(defaultCell, mdRelations, containerCellRef.current, 5);
    }
  }, [relationRow, dirtyCell]);

  const persistChange = (newPaths: string[]) => {
    const oldPaths = relationCell
      ? relationCell.map((relation) => relation.path)
      : [];
    const updatedRequired =
      newPaths.length !== oldPaths.length ||
      newPaths.some((path) => !oldPaths.includes(path));

    if (updatedRequired) {
      const newRelations = newPaths
        // Create a new link for each path
        .map((path) => DataviewService.getDataviewAPI().fileLink(path));

      const newCell = ParseService.parseRowToLiteral(
        relationRow,
        tableColumn,
        newRelations
      );

      dataActions.updateCell(
        row.index,
        tableColumn,
        newCell,
        columnsInfo.getAllColumns(),
        configInfo.getLocalSettings()
      );
    }
    setDirtyCell(false);
  };

  const handleOnClick: MouseEventHandler<HTMLSpanElement> = (event) => {
    event.stopPropagation();
    // Check if the column has a relation asotiated
    if (tableColumn.config.related_note_path) {
      setDirtyCell(true);
    } else {
      new Notice(
        "This column is not associated with a relation. Please, edit the column configuration first",
        1500
      );
    }
  };

  return dirtyCell ? (
    <RelationEditor
      defaultCell={defaultCell}
      persistChange={persistChange}
      relationCell={relationCell}
    />
  ) : (
    <span
      ref={containerCellRef}
      onClick={handleOnClick}
      style={{ width: column.getSize() }}
      className={c(
        getAlignmentClassname(tableColumn.config, configInfo.getLocalSettings())
      )}
    />
  );
};

export default RelationCell;
