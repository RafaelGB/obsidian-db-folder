import React from "react";
import { grey } from "helpers/Colors";
import { RelationshipProps } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";

export default function Relationship(relationShipProps: RelationshipProps) {
  const { value, backgroundColor } = relationShipProps;
  return (
    <span
      className={c("relationship")}
      style={{
        backgroundColor: backgroundColor
      }}
    >
      {value}
    </span>
  );
}
