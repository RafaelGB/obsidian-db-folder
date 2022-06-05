import { RowSelectOption, TagsProps } from "cdm/ComponentsModel";
import Relationship from "components/RelationShip";
import CreatableSelect from "react-select/creatable";

import { grey } from "helpers/Colors";
import React, { useState } from "react";
import { ActionMeta, OnChangeValue } from "react-select";
import { c } from "helpers/StylesHelper";

const TagsPortal = (tagsProps: TagsProps) => {
  const { intialState, column, dispatch, cellProperties } = tagsProps;
  const { row } = cellProperties;
  // Tags reference state
  const [showSelectTags, setShowSelectTags] = useState(false);
  // tags values state
  const [tagsState, setTagsState] = useState(
    intialState.data[row.index][column.key]
  );

  function getColor() {
    const match = column.options.find(
      (option: { label: string }) => option.label === tagsState
    );
    return (match && match.backgroundColor) || grey(200);
  }
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
          closeMenuOnSelect={false}
          isMulti
          options={multiOptions}
          onBlur={() => setShowSelectTags(false)}
          onChange={handleOnChange}
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
              <Relationship
                value={tagsState.toString()}
                backgroundColor={getColor()}
              />
            </div>
          )}
    </>
  );
};
export default TagsPortal;
