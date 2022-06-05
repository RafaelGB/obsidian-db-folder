import { RowSelectOption, TagsProps } from "cdm/ComponentsModel";
import Relationship from "components/RelationShip";
import Select, { StylesConfig } from "react-select";
import { grey } from "helpers/Colors";
import React, { useState } from "react";
import { usePopper } from "react-popper";
import ReactDOM from "react-dom";
import { StyleVariables } from "helpers/Constants";

const TagsPortal = (tagsProps: TagsProps) => {
  const { intialState, column, dispatch, cellProperties } = tagsProps;
  const { row } = cellProperties;
  // Tags reference state
  const [showSelectTags, setShowSelectTags] = useState(false);
  const [tagsRef, setTagsRef] = useState(null);
  // Selector popper state
  const [tagsPop, setTagsPop] = useState(null);
  const { styles, attributes } = usePopper(tagsRef, tagsPop);
  // Selector popper state
  const [domReady, setDomReady] = useState(false);
  // tags values state
  const [tagsState, setTagsState] = useState(
    intialState.data[row.index][column.key]
  );

  React.useEffect(() => {
    setDomReady(true);
  });

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
  function PortalTags() {
    return (
      <div
        className="menu"
        ref={setTagsPop}
        {...attributes.popper}
        style={{
          ...styles.popper,
          padding: "0.75rem",
          background: StyleVariables.BACKGROUND_SECONDARY,
          overflow: "visible",
        }}
      >
        {showSelectTags && (
          <Select
            closeMenuOnSelect={false}
            isMulti
            options={multiOptions}
            onBlur={() => setShowSelectTags(false)}
          />
        )}
      </div>
    );
  }
  return (
    <>
      <div
        ref={setTagsRef}
        className="cell-padding d-flex cursor-default align-items-center flex-1"
        onClick={() => setShowSelectTags(!showSelectTags)}
      >
        {tagsState && (
          <Relationship
            value={tagsState.toString()}
            backgroundColor={getColor()}
          />
        )}
      </div>
      {domReady && showSelectTags
        ? ReactDOM.createPortal(
            PortalTags(),
            document.getElementById("popper-container")
          )
        : null}
    </>
  );
};
export default TagsPortal;
