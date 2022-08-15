import React, { useState } from "react";
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
import { AddColumnModal } from "components/modals/newColumn/addColumnModal";
import { InputType, MetadataColumns } from "helpers/Constants";
import { LOGGER } from "services/Logger";
import { DatabaseHeaderProps, TableColumn } from "cdm/FolderModel";
import ReactDOM from "react-dom";
import { c } from "helpers/StylesHelper";
import { RowSelectOption } from "cdm/ComponentsModel";
import { AddColumnModalProps } from "cdm/ModalsModel";

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
  const { header, table } = headerProps;
  const { tableState } = table.options.meta;

  const [columns, addToLeft, columnInfo, columnActions] = tableState.columns(
    (state) => [state.columns, state.addToLeft, state.info, state.actions]
  );

  const ddbbConfig = tableState.configState((state) => state.ddbbConfig);
  const filtersConfig = tableState.configState((state) => state.filters);
  /** Column values */

  const { id, input, options, label, config } = header.column
    .columnDef as TableColumn;
  /** reducer asociated to database */
  const [expanded, setExpanded] = useState(created || false);
  const [domReady, setDomReady] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [labelState, setLabelState] = useState(label);
  React.useEffect(() => {
    if (!domReady) {
      setDomReady(true);
    }
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

  function handlerAddColumnToLeft(e: any) {
    const addColumnProps: AddColumnModalProps = {
      columnsState: {
        columns,
        addToLeft,
        info: columnInfo,
        actions: columnActions,
      },
      ddbbConfig: ddbbConfig,
      filters: filtersConfig,
    };
    new AddColumnModal(table.options.meta.view, addColumnProps).open();
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
