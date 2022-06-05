import { RowSelectOption, TagsProps } from "cdm/ComponentsModel";
import Relationship from "components/RelationShip";
import CreatableSelect from "react-select/creatable";

import { grey } from "helpers/Colors";
import React, { useState } from "react";
import { usePopper } from "react-popper";
import ReactDOM from "react-dom";
import { StyleVariables } from "helpers/Constants";
import { ActionMeta, OnChangeValue } from "react-select";

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

  function PortalTags() {
    return (
      <div
        className="menu"
        style={{
          padding: "0.75rem",
          background: StyleVariables.BACKGROUND_SECONDARY,
          zIndex: 4,
          minWidth: 200,
          maxWidth: 320,
        }}
      >
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
        ? PortalTags()
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
