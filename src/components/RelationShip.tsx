import React, { useEffect, useRef } from "react";
import { RelationshipProps } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import { MarkdownService } from "services/MarkdownRenderService";

export default function Relationship(relationShipProps: RelationshipProps) {
  const { value, backgroundColor, view } = relationShipProps;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      MarkdownService.renderStringAsMarkdown(
        view,
        value?.toString(),
        ref.current,
        3
      );
    }
  }, [value]);

  return (
    <div
      className={c("relationship")}
      ref={ref}
      style={{
        backgroundColor: backgroundColor,
      }}
    />
  );
}
