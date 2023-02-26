import { RelationEditorComponentProps, SelectValue } from "cdm/ComponentsModel";
import React, { useEffect } from "react";
import { useState } from "react";
import CustomTagsStyles from "components/styles/TagsStyles";
import { c } from "helpers/StylesHelper";
import { TableColumn } from "cdm/FolderModel";
import { Link } from "obsidian-dataview";
import { ActionMeta, OnChangeValue } from "react-select";
import { StyleVariables } from "helpers/Constants";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CreatableSelect from "react-select/creatable";
import { RelationalService } from "services/RelationalService";

const RelationEditor = (props: RelationEditorComponentProps) => {
  const { defaultCell, persistChange, relationCell } = props;
  const { column } = defaultCell;
  const tableColumn = column.columnDef as TableColumn;

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
  const handleOnChange = async (
    newValue: OnChangeValue<SelectValue, true>,
    actionMeta: ActionMeta<SelectValue>
  ) => {
    switch (actionMeta.action) {
      case "create-option":
        await RelationalService.createNoteIntoRelation(
          tableColumn.config.related_note_path,
          actionMeta.option.value
        );
        break;
      default:
      // Do nothing
    }

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
  const handleClickAway = () => {
    persistChange(relationValue.map((link) => link.value));
  };

  useEffect(() => {
    setTimeout(async () => {
      const { recordRows } = await RelationalService.obtainInfoFromRelation(
        tableColumn.config.related_note_path
      );

      const multiOptions = Object.entries(recordRows).map(([key, value]) => ({
        label: value,
        value: key,
        color: tableColumn.config.relation_color,
      }));

      setRelationOptions(multiOptions);
    }, 0);
  }, []);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={c("relation")}>
        <CreatableSelect
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
          onChange={handleOnChange}
          menuPortalTarget={activeDocument.body}
          className={`${c("tags-container text-align-center")}`}
          classNamePrefix="react-select"
          menuPlacement="auto"
          menuShouldBlockScroll={true}
        />
      </div>
    </ClickAwayListener>
  );
};

export default RelationEditor;
