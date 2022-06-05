import { RowSelectOption, TagsProps } from "cdm/ComponentsModel";
import Relationship from "components/RelationShip";
import CreatableSelect from "react-select/creatable";

import { grey } from "helpers/Colors";
import React, { useState } from "react";
import { ActionMeta, OnChangeValue } from "react-select";
import { c } from "helpers/StylesHelper";
import { Literal } from "obsidian-dataview/lib/data-model/value";

const TagsPortal = (tagsProps: TagsProps) => {
  const { intialState, column, dispatch, cellProperties } = tagsProps;
  const { row } = cellProperties;
  // Tags reference state
  const [showSelectTags, setShowSelectTags] = useState(false);
  // tags values state
  const [tagsState, setTagsState] = useState(
    intialState.data[row.index][column.key] as Literal[]
  );

  function getColor(tag: string) {
    const match = column.options.find(
      (option: { label: string }) => option.label === tag
    );
    return (match && match.backgroundColor) || grey(200);
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
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  function TagsForm() {
    return (
      <div className={c("tags")}>
        <CreatableSelect
          defaultValue={defaultValue}
          closeMenuOnSelect={false}
          isMulti
          options={multiOptions}
          onBlur={() => setShowSelectTags(false)}
          onChange={handleOnChange}
          menuPortalTarget={document.getElementById("popper-container")}
          isSearchable
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
              className="cell-padding d-flex cursor-default align-items-center flex-1"
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
