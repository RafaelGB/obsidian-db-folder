import { RelationEditorComponentProps, SelectValue } from "cdm/ComponentsModel";
import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import CustomTagsStyles from "components/styles/TagsStyles";
import { c } from "helpers/StylesHelper";
import { obtainInfoFromRelation } from "helpers/RelationHelper";
import { TableColumn } from "cdm/FolderModel";
import { Link } from "obsidian-dataview";
import { OnChangeValue } from "react-select";
import { StyleVariables } from "helpers/Constants";

const RelationEditor = (props: RelationEditorComponentProps) => {
  const { defaultCell, persistChange, relationCell } = props;
  const { table, column } = defaultCell;
  const tableColumn = column.columnDef as TableColumn;
  const { tableState } = table.options.meta;
  const columnsInfo = tableState.columns((state) => state.info);

  const [relationValue, setRelationValue] = useState(
    relationCell
      ? relationCell.map((link: Link) => ({
          label: link.fileName(),
          value: link.path,
          color: StyleVariables.TEXT_NORMAL,
        }))
      : []
  );
  const [relationOptions, setRelationOptions] = useState([]);

  // onChange handler
  const handleOnChange = async (newValue: OnChangeValue<SelectValue, true>) => {
    const arrayTags = newValue.map((tag) => ({
      label: tag.label,
      value: tag.value,
      color: StyleVariables.TEXT_NORMAL,
    }));
    setRelationValue(arrayTags);
  };

  /**
   * Save changes and close editor
   */
  const handleOnBlur = () => {
    persistChange(relationValue.map((link) => link.value));
  };

  useEffect(() => {
    setTimeout(async () => {
      const { recordRows } = await obtainInfoFromRelation(
        tableColumn.config.related_note_path
      );

      const multiOptions = Object.entries(recordRows).map(([key, value]) => ({
        label: value,
        value: key,
        color: StyleVariables.TEXT_NORMAL,
      }));

      setRelationOptions(multiOptions);
    }, 0);
  }, []);

  return (
    <div className={c("relation")}>
      <Select
        defaultValue={relationValue}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
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
        className={`${c("tags-container text-align-center")}`}
        classNamePrefix="react-select"
        menuPlacement="auto"
        menuShouldBlockScroll={true}
      />
    </div>
  );
};

export default RelationEditor;
