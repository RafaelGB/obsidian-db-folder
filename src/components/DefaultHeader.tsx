import React, { MouseEventHandler, useState } from "react";
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
import RelationBidirectionalIcon from "components/img/RelationBidirectionalIcon";
import RollupIcon from "components/img/RollupIcon";
import { AddColumnModal } from "components/modals/newColumn/addColumnModal";
import {
  BaseFilter,
  BooleanFilter,
  DateRangeFilter,
  NumberFilter,
  TextFilter,
} from "components/reducers/ColumnFilters";
import { InputType, MetadataColumns } from "helpers/Constants";
import { LOGGER } from "services/Logger";
import { DatabaseHeaderProps, TableColumn } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import {
  AddColumnModalProps,
  BaseColumnModalProps,
  ColumnSettingsModalProps,
} from "cdm/ModalsModel";

/**
 * Default headers of the table
 * @param headerProps
 * @returns
 */
export default function DefaultHeader(headerProps: DatabaseHeaderProps) {
  LOGGER.debug(`=>Header ${headerProps.column.columnDef}`);
  /** Properties of header */
  const { header, table } = headerProps;
  const { tableState } = table.options.meta;

  const columnsInfo = tableState.columns((state) => state.info);
  const columnActions = tableState.columns((state) => state.actions);
  const dataActions = tableState.data((state) => state.actions);

  const areColumnsFilterable = tableState.configState(
    (state) => state.ephimeral.enable_columns_filter
  );

  const configInfo = tableState.configState((state) => state.info);

  /** Column values */
  const { id, input, label, config } = header.column.columnDef as TableColumn;
  /** reducer asociated to database */
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const [referenceElement, setReferenceElement] = useState(null);
  const [labelState, setLabelState] = useState(label);

  let propertyIcon: JSX.Element;
  let columnSearch = <TextFilter {...headerProps} />;
  switch (input) {
    case InputType.NUMBER:
      propertyIcon = <HashIcon />;
      columnSearch = <NumberFilter {...headerProps} />;
      break;
    case InputType.TEXT:
      propertyIcon = <TextIcon />;
      break;
    case InputType.SELECT:
      propertyIcon = <MultiIcon />;
      break;
    case InputType.CALENDAR:
      propertyIcon = <CalendarIcon />;
      columnSearch = <DateRangeFilter {...headerProps} />;
      break;
    case InputType.CALENDAR_TIME:
    case InputType.METATADA_TIME:
      propertyIcon = <CalendarTimeIcon />;
      columnSearch = <DateRangeFilter {...headerProps} />;
      break;
    case InputType.MARKDOWN:
      propertyIcon = <MarkdownObsidian />;
      columnSearch = <BaseFilter {...headerProps} />;
      break;
    case InputType.TAGS:
      propertyIcon = <TagsIcon />;
      columnSearch = <BaseFilter {...headerProps} />;
      break;
    case InputType.INLINKS:
      propertyIcon = <IncomingLinkIcon />;
      columnSearch = <BaseFilter {...headerProps} />;
      break;
    case InputType.OUTLINKS:
      propertyIcon = <OutlinkIcon />;
      columnSearch = <BaseFilter {...headerProps} />;
      break;
    case InputType.TASK:
      propertyIcon = <TaskIcon />;
      columnSearch = <BaseFilter {...headerProps} />;
      break;
    case InputType.CHECKBOX:
      propertyIcon = <TaskIcon />;
      columnSearch = <BooleanFilter {...headerProps} />;
      break;
    case InputType.FORMULA:
      propertyIcon = <CodeIcon />;
      break;
    case InputType.RELATION:
      propertyIcon = <RelationBidirectionalIcon />;
      columnSearch = <BaseFilter {...headerProps} />;
      break;
    case InputType.ROLLUP:
      propertyIcon = <RollupIcon />;
      break;
    default:
    // Do nothing
  }

  function handlerAddColumnToLeft() {
    const addColumnProps: AddColumnModalProps = {
      dataState: { actions: dataActions },
      columnState: {
        info: columnsInfo,
        actions: columnActions,
      },
      configState: { info: configInfo },
      view: table.options.meta.view,
    };
    new AddColumnModal(table.options.meta.view, addColumnProps).open();
  }

  const openMenuHandler: MouseEventHandler<HTMLDivElement> = (event) => {
    setMenuEl(menuEl ? null : event.currentTarget);
  };

  LOGGER.debug(`<=Header ${label}`);
  return id !== MetadataColumns.ADD_COLUMN ? (
    <>
      <div
        className={`${c("th-content")}`}
        onClick={openMenuHandler}
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
      {/** Header Filter */}
      {areColumnsFilterable && columnSearch}
      {/** Header Menu Popper */}
      <HeaderMenu
        headerProps={headerProps}
        propertyIcon={propertyIcon}
        menuEl={menuEl}
        setMenuEl={setMenuEl}
        referenceElement={referenceElement}
        labelState={labelState}
        setLabelState={setLabelState}
      />
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
