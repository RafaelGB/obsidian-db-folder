import React, { useContext, useState } from "react";
import { randomColor } from "helpers/Colors";
import TextIcon from "components/img/Text";
import MultiIcon from "components/img/Multi";
import HashIcon from "components/img/Hash";
import PlusIcon from "components/img/Plus";
import ArrowDown from "components/img/ArrowDown";
import ArrowUp from "components/img/ArrowUp";
import HeaderMenu from "components/HeaderMenu";
import CalendarIcon from "components/img/CalendarIcon";
import MarkdownObsidian from "components/img/Markdown";
import CalendarTimeIcon from "components/img/CalendarTime";
import TaskIcon from "components/img/TaskIcon";
import TagsIcon from "components/img/TagsIcon";
import { ActionTypes, InputType, MetadataColumns } from "helpers/Constants";
import { LOGGER } from "services/Logger";
import { DatabaseHeaderProps, TableColumn } from "cdm/FolderModel";
import ReactDOM from "react-dom";
import { c } from "helpers/StylesHelper";
import { RowSelectOption } from "cdm/ComponentsModel";

/**
 * Generate column Options with Select type
 * @param options
 * @param rows
 * @param columnId
 * @returns
 */
function setOptionsOfSelectDataType(
  options: RowSelectOption[],
  rows: any,
  columnId: string
): any[] {
  rows.forEach((row: any) => {
    const rowValue = row.original[columnId];
    let match = options.find(
      (option: { label: string }) => option.label === rowValue
    );
    if (!match && rowValue !== undefined && rowValue !== "") {
      options.push({ label: rowValue, backgroundColor: randomColor() });
    }
  });
  return options;
}

/**
 * Default headers of the table
 * @param headerProps
 * @returns
 */
export default function DefaultHeader(headerProps: DatabaseHeaderProps) {
  LOGGER.debug(`=>Header ${headerProps.column.columnDef}`);
  // TODO : add a tooltip to the header
  const created: boolean = false;
  /** Properties of header */
  const { column, header, table } = headerProps;

  /** Column values */
  const { id, input, options, position, label, config } =
    column.columnDef as TableColumn;
  /** reducer asociated to database */
  // TODO typying improve
  const dispatch = (table.options.meta as any).dispatch;
  const [expanded, setExpanded] = useState(created || false);
  const [domReady, setDomReady] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [labelState, setLabelState] = useState(label);
  React.useEffect(() => {
    setDomReady(true);
  });

  let propertyIcon: JSX.Element;
  switch (input) {
    case InputType.NUMBER:
      propertyIcon = <HashIcon />;
      break;
    case InputType.TEXT:
      propertyIcon = <TextIcon />;
      break;
    case InputType.SELECT:
      setOptionsOfSelectDataType(options, table.getRowModel().rows, id);
      propertyIcon = <MultiIcon />;
      break;
    case InputType.CALENDAR:
      propertyIcon = <CalendarIcon />;
      break;
    case InputType.CALENDAR_TIME:
      propertyIcon = <CalendarTimeIcon />;
      break;
    case InputType.MARKDOWN:
      propertyIcon = <MarkdownObsidian />;
      break;
    case InputType.TAGS:
      propertyIcon = <TagsIcon />;
      break;
    case InputType.TASK:
    case InputType.CHECKBOX:
      propertyIcon = <TaskIcon />;
      break;
    default:
      break;
  }

  function adjustWidthOfTheColumn(position: number) {
    let columnNumber =
      (table.options.meta as any).columns.length +
      1 -
      (table.options.meta as any).shadowColumns.length;
    // Check if column name already exists
    while (
      table
        .getAllColumns()
        .find((o: any) => o.id === `newColumn${columnNumber}`)
    ) {
      columnNumber++;
    }
    const columnName = `newColumn${columnNumber}`;
    const columnLabel = `New Column ${columnNumber}`;
    // Add width of the new column
    return { name: columnName, position: position, label: columnLabel };
  }

  function handlerAddColumnToLeft(e: any) {
    dispatch({
      type: ActionTypes.ADD_COLUMN_TO_LEFT,
      columnId: MetadataColumns.ADD_COLUMN,
      focus: true,
      columnInfo: adjustWidthOfTheColumn(position - 1),
    });
  }

  LOGGER.debug(`<=Header ${label}`);
  return id !== MetadataColumns.ADD_COLUMN ? (
    <>
      <div
        className={`${c("th-content")}`}
        onClick={() => setExpanded(true)}
        ref={setReferenceElement}
      >
        <span className="svg-icon svg-gray icon-margin">{propertyIcon}</span>
        {labelState}
        {config.isInline && <span>*</span>}
        {/* Add a sort direction indicator */}
        <span className="svg-icon svg-gray icon-margin">
          {header.column.getIsSorted() ? (
            header.column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : (
              <ArrowUp />
            )
          ) : (
            ""
          )}
        </span>
      </div>
      {domReady
        ? ReactDOM.createPortal(
            <HeaderMenu
              headerProps={headerProps}
              propertyIcon={propertyIcon}
              expanded={expanded}
              setExpanded={setExpanded}
              created={created}
              referenceElement={referenceElement}
              labelState={labelState}
              setLabelState={setLabelState}
            />,
            activeDocument.getElementById("popper-container")
          )
        : null}
    </>
  ) : (
    <div
      className={`${c("th-content")}`}
      style={{ display: "flex", justifyContent: "center" }}
      onClick={handlerAddColumnToLeft}
    >
      <span className="svg-icon-sm svg-gray">
        <PlusIcon />
      </span>
    </div>
  );
}
