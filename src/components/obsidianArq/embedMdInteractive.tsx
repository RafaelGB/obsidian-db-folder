import { Row } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { DatabaseView } from "views/DatabaseView";
import { getNormalizedPath } from "helpers/VaultManagement";
import { TFile } from "obsidian";
import React, { useEffect } from "react";
import { PointerEventHandler, useRef } from "react";
import { MarkdownService } from "services/MarkdownRenderService";

/**
 * Modify on disk checkbox state
 * @param checkbox
 * @returns
 */
export async function checkEmbeddedCheckbox(checkbox: HTMLElement) {
  const file = app.vault.getAbstractFileByPath(checkbox.dataset.src);

  if (!(file instanceof TFile)) return;

  const content = await app.vault.cachedRead(file);
  const start = parseInt(checkbox.dataset.oStart);
  const end = parseInt(checkbox.dataset.oEnd);
  const li = content.substring(start, end);
  const updated = li.replace(
    /^(.+?)\[(.)\](.+)(\s{0,1})$/,
    (_, g1, g2, g3, g4) => {
      if (g2 !== " ") {
        checkbox.parentElement.removeClass("is-checked");
        checkbox.parentElement.dataset.task = "";
        return `${g1}[ ]${g3}${g4}`;
      }

      checkbox.parentElement.addClass("is-checked");
      checkbox.parentElement.dataset.task = "x";
      return `${g1}[x]${g3}${g4}`;
    }
  );

  await app.vault.modify(
    file,
    `${content.substring(0, start)}${updated}${content.substring(end)}`
  );
}

export const MdFileComponent = ({
  row,
  view,
}: {
  row: Row<RowDataType>;
  view: DatabaseView;
}) => {
  const containerCellRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (containerCellRef.current === null) return;
    setTimeout(
      async () => {
        const normalizedPath = getNormalizedPath(
          row.original.__note__.filepath
        );
        await MarkdownService.handleMarkdown(
          containerCellRef.current,
          row.original.__note__.getFile(),
          normalizedPath,
          view,
          5
        );
      },
      containerCellRef.current.innerHTML ? 500 : 0
    );
  }, [row]);

  const onCheckboxContainerClick: PointerEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement;

    if (target.hasClass("task-list-item-checkbox")) {
      if (target.dataset.src) {
        return checkEmbeddedCheckbox(target);
      }
    }
  };

  return (
    <div
      ref={containerCellRef}
      key={`expanded-md-file-${row.index}`}
      onPointerDown={onCheckboxContainerClick}
    />
  );
};
