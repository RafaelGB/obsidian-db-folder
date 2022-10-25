import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import CustomTagsStyles from "components/styles/TagsStyles";
import { InputType } from "helpers/Constants";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { Link } from "obsidian-dataview";
import React, { useEffect, useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { ParseService } from "services/ParseService";

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

  const EditRelations = () => {
    const initValue = relationCell
      ? relationCell.map((link: Link) => ({
          label: link.fileName(),
          value: link.path,
          color: "var(--text-normal)",
        }))
      : [];

    const multiOptions = [
      {
        label: "test",
        value: "test",
        color: "var(--text-normal)",
      },
      {
        label: "test2",
        value: "test2",
        color: "var(--text-normal)",
      },
      {
        label: "test3",
        value: "test3",
        color: "var(--text-normal)",
      },
    ];
    return (
      <div className={c("relation")}>
        <CreatableSelect
          defaultValue={initValue}
          closeMenuOnSelect={false}
          isSearchable
          isMulti
          autoFocus
          openMenuOnFocus
          menuPosition="fixed"
          styles={CustomTagsStyles}
          options={multiOptions}
          onBlur={() => setDirtyCell(false)}
          //onChange={handleOnChange}
          menuPortalTarget={activeDocument.body}
          className={`react-select-container ${c(
            "tags-container text-align-center"
          )}`}
          classNamePrefix="react-select"
          menuPlacement="auto"
          menuShouldBlockScroll={true}
        />
      </div>
    );
  };

  return dirtyCell ? (
    EditRelations()
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
