import React, { useState } from "react";
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
import OutlinkIcon from "components/img/OutlinkIcon";
import IncomingLinkIcon from "components/img/IncomingLinkIcon";
import CodeIcon from "components/img/CodeIcon";
import ArrowUpRight from "components/img/ArrowUpRight";
import { AddColumnModal } from "components/modals/newColumn/addColumnModal";
import { InputType, MetadataColumns } from "helpers/Constants";
import { LOGGER } from "services/Logger";
import { DatabaseHeaderProps, TableColumn } from "cdm/FolderModel";
import ReactDOM from "react-dom";
import { c } from "helpers/StylesHelper";
import { AddColumnModalProps } from "cdm/ModalsModel";

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

  const [columnInfo, columnActions] = tableState.columns((state) => [
    state.info,
    state.actions,
  ]);

  const configInfo = tableState.configState((state) => state.info);

  /** Column values */
  const { id, input, options, label, config } = header.column
    .columnDef as TableColumn;
  /** reducer asociated to database */
  const [expanded, setExpanded] = useState(created || false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [labelState, setLabelState] = useState(label);

  let propertyIcon: JSX.Element;
  switch (input) {
    case InputType.NUMBER:
      propertyIcon = <HashIcon />;
      break;
    case InputType.TEXT:
      propertyIcon = <TextIcon />;
      break;
    case InputType.SELECT:
      propertyIcon = <MultiIcon />;
      break;
    case InputType.CALENDAR:
      propertyIcon = <CalendarIcon />;
      break;
    case InputType.CALENDAR_TIME:
    case InputType.METATADA_TIME:
      propertyIcon = <CalendarTimeIcon />;
      break;
    case InputType.MARKDOWN:
      propertyIcon = <MarkdownObsidian />;
      break;
    case InputType.TAGS:
      propertyIcon = <TagsIcon />;
      break;
    case InputType.INLINKS:
      propertyIcon = <IncomingLinkIcon />;
      break;
    case InputType.OUTLINKS:
      propertyIcon = <OutlinkIcon />;
      break;
    case InputType.TASK:
    case InputType.CHECKBOX:
      propertyIcon = <TaskIcon />;
      break;
    case InputType.FORMULA:
      propertyIcon = <CodeIcon />;
      break;
    case InputType.RELATION:
      propertyIcon = <ArrowUpRight />;
      break;
    default:
      break;
  }

  function handlerAddColumnToLeft() {
    const addColumnProps: AddColumnModalProps = {
      columnsState: {
        info: columnInfo,
        actions: columnActions,
      },
      ddbbConfig: configInfo.getLocalSettings(),
      filters: configInfo.getFilters(),
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
        {header.column.getSortIndex() !== -1 && (
          <span className="svg-icon svg-gray icon-margin">
            {header.column.getSortIndex() + 1}
          </span>
        )}
      </div>
      {ReactDOM.createPortal(
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
        activeDocument.body
      )}
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
