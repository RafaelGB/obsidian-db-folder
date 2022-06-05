import { TagsProps } from "cdm/ComponentsModel";
import Relationship from "components/RelationShip";
import { grey } from "helpers/Colors";
import React, { useState } from "react";

const TagsPortal = (tagsProps: TagsProps) => {
  const { intialState, column, dispatch, cellProperties } = tagsProps;
  const { row } = cellProperties;
  const [tagsState, setTagsState] = useState(
    intialState.data[row.index][column.key]
  );

  function getColor() {
    const match = column.options.find(
      (option: { label: string }) => option.label === tagsState
    );
    return (match && match.backgroundColor) || grey(200);
  }
  return (
    <div className="cell-padding d-flex cursor-default align-items-center flex-1">
      {tagsState && (
        <Relationship
          value={tagsState.toString()}
          backgroundColor={getColor()}
        />
      )}
    </div>
  );
};
export default TagsPortal;
