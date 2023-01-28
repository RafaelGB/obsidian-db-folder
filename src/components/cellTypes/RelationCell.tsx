import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { InputType } from "helpers/Constants";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { Notice } from "obsidian";
import { Link } from "obsidian-dataview";
import React, { useState } from "react";
import { DataviewService } from "services/DataviewService";
import { ParseService } from "services/ParseService";
import RelationEditor from "components/cellTypes/Editor/RelationEditor";
import Relationship from "components/RelationShip";
import { grey } from "helpers/Colors";

const RelationCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { table, row, column } = defaultCell;
  const { tableState, view } = table.options.meta;
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

  const [dirtyCell, setDirtyCell] = useState(false);

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

      dataActions.updateCell({
        rowIndex: row.index,
        column: tableColumn,
        value: newCell,
        columns: columnsInfo.getAllColumns(),
        ddbbConfig: configInfo.getLocalSettings(),
      });

      if (tableColumn.config.bidirectional_relation) {
        dataActions.updateBidirectionalRelation(
          relationRow,
          tableColumn,
          oldPaths,
          newPaths
        );
      }
    }
    setDirtyCell(false);
  };

  const handleOnClick = () => {
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
    <div
      onDoubleClick={handleOnClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleOnClick();
        }
      }}
      style={{ width: column.getSize() }}
      className={c(
        getAlignmentClassname(
          tableColumn.config,
          configInfo.getLocalSettings(),
          ["tabIndex", "tags-container"]
        )
      )}
      tabIndex={0}
    >
      {relationCell
        ? relationCell.map((link: Link, index) => (
            <Relationship
              key={`relation-${index}-${tableColumn.key}-${link.path}`}
              value={link.markdown()}
              backgroundColor={tableColumn.config.relation_color || grey(300)}
              view={view}
            />
          ))
        : null}
    </div>
  );
};

export default RelationCell;
