import {
  EditorCellComponentProps,
  RelationEditorComponentProps,
} from "cdm/ComponentsModel";

import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useState } from "react";
import { MarkdownEditor } from "components/cellTypes/Editor/MarkdownEditor";
import CreatableSelect from "react-select/creatable";
import CustomTagsStyles from "components/styles/TagsStyles";
import { c } from "helpers/StylesHelper";
import { recordRowsFromRelation } from "helpers/RelationHelper";
import { TableColumn } from "cdm/FolderModel";
import { Link } from "obsidian-dataview";

const RelationEditor = (props: RelationEditorComponentProps) => {
  const { defaultCell, persistChange, relationCell } = props;
  const { table, column } = defaultCell;
  const tableColumn = column.columnDef as TableColumn;
  const { tableState } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);
  /** Ref to cell container */
  const editableMdRef = useRef<HTMLInputElement>();
  /** Columns information */

  const [relationValue, setRelationValue] = useState(
    relationCell
      ? relationCell.map((link: Link) => ({
          label: link.fileName(),
          value: link.path,
          color: "var(--text-normal)",
        }))
      : []
  );
  const [relationOptions, setRelationOptions] = useState([
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
  ]);

  // onChange handler
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    //setEditorValue(value);
  };

  /** Call onBlur */
  const handleEnter = () => {
    editableMdRef.current.blur();
  };

  /**
   * Close editor undoing any changes realised
   */
  const handleOnEscape = useCallback(() => {
    //persistChange(relationCell);
  }, []);

  /**
   * Save changes and close editor
   */
  const handleOnBlur = () => {
    persistChange(relationValue.map((link) => link.value));
  };

  const initValue = useMemo(() => {
    return relationCell
      ? relationCell.map((link: Link) => ({
          label: link.fileName(),
          value: link.path,
          color: "var(--text-normal)",
        }))
      : [];
  }, []);

  const relationRowsCallBack = useCallback(async () => {
    const relationRows = await recordRowsFromRelation(
      tableColumn.config.related_note_path,
      configInfo.getLocalSettings()
    );
    const multiOptions = Object.entries(relationRows).map(([key, value]) => ({
      label: value,
      value: key,
      color: "var(--text-normal)",
    }));
    setRelationOptions(multiOptions);
  }, []);

  useEffect(() => {
    relationRowsCallBack();
  }, []);
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
        options={relationOptions}
        onBlur={handleOnBlur}
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

export default RelationEditor;
