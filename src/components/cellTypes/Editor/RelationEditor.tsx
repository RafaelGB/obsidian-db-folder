import { RelationEditorComponentProps, SelectValue } from "cdm/ComponentsModel";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import CustomTagsStyles from "components/styles/TagsStyles";
import { c } from "helpers/StylesHelper";
import { recordRowsFromRelation } from "helpers/RelationHelper";
import { TableColumn } from "cdm/FolderModel";
import { Link } from "obsidian-dataview";
import { OnChangeValue } from "react-select";

const RelationEditor = (props: RelationEditorComponentProps) => {
  const { defaultCell, persistChange, relationCell } = props;
  const { table, column } = defaultCell;
  const tableColumn = column.columnDef as TableColumn;
  const { tableState } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);

  const [relationValue, setRelationValue] = useState(
    relationCell
      ? relationCell.map((link: Link) => ({
          label: link.fileName(),
          value: link.path,
          color: "var(--text-normal)",
        }))
      : []
  );
  const [relationOptions, setRelationOptions] = useState([]);

  // onChange handler
  const handleOnChange = async (newValue: OnChangeValue<SelectValue, true>) => {
    const arrayTags = newValue.map((tag) => ({
      label: tag.value,
      value: tag.value,
      color: "var(--text-normal)",
    }));
    setRelationValue(arrayTags);
  };

  /**
   * Save changes and close editor
   */
  const handleOnBlur = () => {
    persistChange(relationValue.map((link) => link.value));
  };

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
      <Select
        defaultValue={relationValue}
        closeMenuOnSelect={false}
        isSearchable
        isMulti
        autoFocus
        openMenuOnFocus
        menuPosition="fixed"
        styles={CustomTagsStyles}
        options={relationOptions}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
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
