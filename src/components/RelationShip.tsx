import React from "react";
import {grey} from "helpers/Colors";
import { RelationshipProps } from "cdm/FolderModel";

export default function Relationship(relationShipProps:RelationshipProps) {
const {value, backgroundColor} = relationShipProps;
  return (
    <span
      style={{
        boxSizing: "border-box",
        backgroundColor: backgroundColor,
        color: grey(800),
        fontWeight: 400,
        padding: "2px 6px",
        borderRadius: 4,
        textTransform: "capitalize",
        display: "inline-block"
      }}>
      {value}
    </span>
  );
}
