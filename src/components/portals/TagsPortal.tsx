import { RowSelectOption, TagsProps } from "cdm/ComponentsModel";
import Relationship from "components/RelationShip";
import CustomTagsStyles from "components/styles/TagsStyles";
import CreatableSelect from "react-select/creatable";
import { grey, randomColor } from "helpers/Colors";
import React, { useState } from "react";
import { ActionMeta, OnChangeValue } from "react-select";
import { c } from "helpers/StylesHelper";
import { Literal } from "obsidian-dataview/lib/data-model/value";
import { ActionTypes } from "helpers/Constants";
import NoteInfo from "services/NoteInfo";

const TagsPortal = (tagsProps: TagsProps) => {
  const { intialState, column, dispatch, cellProperties, columns } = tagsProps;
  const { row } = cellProperties;
  // Tags reference state
  const [showSelectTags, setShowSelectTags] = useState(false);
  // tags values state
  const [tagsState, setTagsState] = useState(
    Array.isArray(intialState.data[row.index][column.key])
      ? (intialState.data[row.index][column.key] as Literal[])
      : []
  );

  /** Note info of current Cell */
  const note: NoteInfo = (cellProperties.row.original as any).note;

  function getColor(tag: string) {
    const match = column.options.find(
      (option: { label: string }) => option.label === tag
    );
    if (match) {
      return match.backgroundColor;
    } else {
      // In case of new tag, generate random color
      const color = randomColor();
      dispatch({
        columns: columns,
        option: tag,
        backgroundColor: color,
        columnId: column.id,
        type: ActionTypes.ADD_OPTION_TO_COLUMN,
      });
      return color;
    }
  }
  const defaultValue = tagsState.map((tag: string) => ({
    label: tag,
    value: tag,
    color: getColor(tag),
  }));

  const multiOptions = column.options.map((option: RowSelectOption) => ({
    value: option.label,
    label: option.label,
    color: option.backgroundColor,
  }));
  const handleOnChange = (
    newValue: OnChangeValue<any, true>,
    actionMeta: ActionMeta<RowSelectOption>
  ) => {
    const arrayTags = newValue.map((tag: any) => tag.value);
    dispatch({
      type: ActionTypes.UPDATE_CELL,
      file: note.getFile(),
      key: column.key,
      value: arrayTags,
      row: cellProperties.row,
      columnId: column.id,
    });
    // Add new option to column options
    newValue
      .filter(
        (tag: any) =>
          tag.__isNew__ &&
          !column.options.find((option: any) => option.label === tag.value)
      )
      .forEach((tag: any) => {
        dispatch({
          columns: columns,
          option: tag.value,
          backgroundColor: randomColor(),
          columnId: column.id,
          type: ActionTypes.ADD_OPTION_TO_COLUMN,
        });
      });
    setTagsState(arrayTags);
  };

  function TagsForm() {
    return (
      <div className={c("tags")}>
        <CreatableSelect
          defaultValue={defaultValue}
          closeMenuOnSelect={false}
          isSearchable
          isMulti
          autoFocus
          menuPosition="fixed"
          styles={CustomTagsStyles}
          options={multiOptions}
          onBlur={() => setShowSelectTags(false)}
          onChange={handleOnChange}
          menuPortalTarget={document.body}
          menuShouldBlockScroll={true}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>
    );
  }
  return (
    <>
      {showSelectTags
        ? TagsForm()
        : tagsState && (
            <div
              className="d-flex flex-wrap-wrap"
              style={{
                padding: "0.75rem",
              }}
              onClick={() => setShowSelectTags(true)}
            >
              {tagsState.map((tag: string) => (
                <div
                  key={`key-${tag}`}
                  style={{ marginRight: "0.5rem", marginTop: "0.5rem" }}
                >
                  <Relationship
                    key={`key-Relationship-${tag}`}
                    value={tag}
                    backgroundColor={getColor(tag)}
                  />
                </div>
              ))}
            </div>
          )}
    </>
  );
};
export default TagsPortal;
