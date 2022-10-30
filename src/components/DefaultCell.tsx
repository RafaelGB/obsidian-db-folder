import React from "react";
import { InputType } from "helpers/Constants";
import { LOGGER } from "services/Logger";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import SelectCell from "components/cellTypes/SelectCell";
import CalendarCell from "components/cellTypes/CalendarCell";
import CalendarTimeCell from "components/cellTypes/CalendarTimeCell";
import CheckboxCell from "components/cellTypes/CheckboxCell";
import TaskCell from "components/cellTypes/TaskCell";
import MarkdownCell from "components/cellTypes/MarkdownCell";
import TagsCell from "components/cellTypes/TagsCell";
import NumberCell from "components/cellTypes/NumberCell";
import TextCell from "components/cellTypes/TextCell";
import MetadataTimeCell from "components/cellTypes/MetadataTimeCell";
import InOutLinksCell from "components/cellTypes/InOutLinksCell";
import FormulaCell from "components/cellTypes/FormulaCell";
import RelationCell from "components/cellTypes/RelationCell";
import RollupCell from "components/cellTypes/RollupCell";
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
        return <CalendarCell defaultCell={defaultCell} />;

      /** Calendar with time option */
      case InputType.CALENDAR_TIME:
        return <CalendarTimeCell defaultCell={defaultCell} />;

      /** Metadata options related with date/datetime */
      case InputType.METATADA_TIME:
        return <MetadataTimeCell defaultCell={defaultCell} />;

      /** Selector option */
      case InputType.SELECT:
        return <SelectCell defaultCell={defaultCell} />;

      /** Tags option */
      case InputType.TAGS:
        return <TagsCell defaultCell={defaultCell} />;

      /** Tasks option */
      case InputType.TASK:
        return <TaskCell defaultCell={defaultCell} />;

      /** InOut links option */
      case InputType.INLINKS:
      case InputType.OUTLINKS:
        return <InOutLinksCell defaultCell={defaultCell} />;

      /** Checkbox option */
      case InputType.CHECKBOX:
        return <CheckboxCell defaultCell={defaultCell} />;

      /** Formula option */
      case InputType.FORMULA:
        return <FormulaCell defaultCell={defaultCell} />;

      /** Relation with another ddbb */
      case InputType.RELATION:
        return <RelationCell defaultCell={defaultCell} />;

      /** Rollup info of a relation */
      case InputType.ROLLUP:
        return <RollupCell defaultCell={defaultCell} />;

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
