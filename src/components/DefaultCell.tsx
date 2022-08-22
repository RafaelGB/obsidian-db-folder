import React from "react";
import { InputType } from "helpers/Constants";
import { LOGGER } from "services/Logger";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import PopperSelectPortal from "components/portals/PopperSelectPortal";
import CalendarPortal from "components/portals/CalendarPortal";
import CalendarTimePortal from "components/portals/CalendarTimePortal";
import CheckboxCell from "components/cellTypes/CheckboxCell";
import TaskCell from "components/cellTypes/TaskCell";
import MarkdownCell from "components/cellTypes/MarkdownCell";
import TagsPortal from "components/portals/TagsPortal";
import NumberCell from "components/cellTypes/NumberCell";
import TextCell from "components/cellTypes/TextCell";
import { CellContext } from "@tanstack/react-table";
import { Literal } from "obsidian-dataview";

export default function DefaultCell(
  defaultCell: CellContext<RowDataType, Literal>
) {
  const { column } = defaultCell;
  /** Type of cell */
  const input = (column.columnDef as TableColumn).input;

  /** states for selector option  */
  LOGGER.debug(`<=> Cell.rendering input: ${input}`);

  function getCellElement() {
    switch (input) {
      /** Plain text option */
      case InputType.TEXT:
        return <TextCell defaultCell={defaultCell} />;

      /** Number option */
      case InputType.NUMBER:
        return <NumberCell defaultCell={defaultCell} />;

      /** Markdown option */
      case InputType.MARKDOWN:
        return <MarkdownCell defaultCell={defaultCell} />;

      /** Calendar option */
      case InputType.CALENDAR:
        return <CalendarPortal defaultCell={defaultCell} />;

      /** Calendar with time option */
      case InputType.CALENDAR_TIME:
        return <CalendarTimePortal defaultCell={defaultCell} />;

      /** Selector option */
      case InputType.SELECT:
        return <PopperSelectPortal defaultCell={defaultCell} />;

      /** Tags option */
      case InputType.TAGS:
        return <TagsPortal defaultCell={defaultCell} />;

      /** Tasks option */
      case InputType.TASK:
        return <TaskCell defaultCell={defaultCell} />;

      /** Checkbox option */
      case InputType.CHECKBOX:
        return <CheckboxCell defaultCell={defaultCell} />;

      /** New column option */
      case InputType.NEW_COLUMN:
        // Do nothing
        break;
      /** Default option */
      default:
        LOGGER.warn(`Unknown input type: ${input}`);
    }
    return <span></span>;
  }
  return getCellElement();
}
