import React, { useEffect, useRef } from "react";
import { RelationshipProps } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import { MarkdownService } from "services/MarkdownRenderService";
import { Db } from "services/CoreService";

export default function Relationship(relationShipProps: RelationshipProps) {
  const { option, view } = relationShipProps;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      MarkdownService.renderStringAsMarkdown(
        view,
        option.label?.toString(),
        ref.current,
        3
      );
    }
  }, [option]);

  return (
    <div
      className={c("relationship")}
      ref={ref}
      style={{
        backgroundColor: option.color,
        color: Db.coreFns.colors.getContrast(option.color),
      }}
    />
  );
}
