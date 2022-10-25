import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import CustomTagsStyles from "components/styles/TagsStyles";
import { InputType } from "helpers/Constants";
import { recordRowsFromRelation } from "helpers/RelationHelper";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { Link } from "obsidian-dataview";
import React, { useEffect, useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { ParseService } from "services/ParseService";
import RelationEditor from "./Editor/RelationEditor";

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

  const persistChange = (newPath: string[]) => {
    console.log("persistChange", newPath);
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
      onClick={() => setDirtyCell(true)}
      style={{ width: column.getSize() }}
      className={c(
        getAlignmentClassname(tableColumn.config, configInfo.getLocalSettings())
      )}
    />
  );
};

export default RelationCell;
