import {
  ColumnOption,
  CellComponentProps,
  SelectValue,
} from "cdm/ComponentsModel";
import Relationship from "components/RelationShip";
import CustomTagsStyles from "components/styles/TagsStyles";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import React, { useMemo, useState } from "react";
import { ActionMeta, OnChangeValue } from "react-select";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { TableColumn } from "cdm/FolderModel";
import { ParseService } from "services/ParseService";
import { InputType, OptionSource } from "helpers/Constants";
import { satinizedColumnOption } from "helpers/FileManagement";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Db } from "services/CoreService";

const TagsCell = (tagsProps: CellComponentProps) => {
  const { defaultCell } = tagsProps;
  const { row, column, table } = defaultCell;
  const { tableState, view } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const columnsInfo = tableState.columns((state) => state.info);
  const configInfo = tableState.configState((state) => state.info);
  const columnActions = tableState.columns((state) => state.actions);
  const dataActions = tableState.data((state) => state.actions);

  const tagsRow = tableState.data((state) => state.rows[row.index]);
  const tagsCell = tableState.data(
    (state) =>
      ParseService.parseRowToCell(
        state.rows[row.index],
        tableColumn,
        InputType.TAGS,
        configInfo.getLocalSettings()
      ) as string[]
  );

  // Tags reference state
  const [showSelectTags, setShowSelectTags] = useState(false);

  const columnOptions = columnsInfo.getColumnOptions(column.id);
  function mapOption(tag: string) {
    const match = columnOptions.find((option) => option.value === tag);
    if (match) {
      return match;
    } else {
      // In case of new tag, generate random color
      const option: ColumnOption = {
        label: tag,
        value: tag,
        color: Db.coreFns.colors.randomColor(),
      };
      columnActions.addOptionToColumn(tableColumn, option);
      return option;
    }
  }

  // Control re renders with useCallback
  const defaultValue = useMemo(() => {
    const optionList = tagsCell || [];
    return optionList.map((tag: string) => mapOption(tag));
  }, [tagsCell]);

  const handleOnChange = async (
    newValue: OnChangeValue<SelectValue, true>,
    actionMeta: ActionMeta<ColumnOption>
  ) => {
    const arrayTags = newValue.map(
      (tag) => `${satinizedColumnOption(tag.value)}`
    );
    const newCell = ParseService.parseRowToLiteral(
      tagsRow,
      tableColumn,
      arrayTags
    );

    // Update on disk & memory
    await dataActions.updateCell({
      rowIndex: row.index,
      column: tableColumn,
      value: newCell,
      columns: columnsInfo.getAllColumns(),
      ddbbConfig: configInfo.getLocalSettings(),
    });

    // Add new option to column options
    if (actionMeta.action === "create-option") {
      newValue
        .filter(
          (tag) =>
            !tableColumn.options.find((option) => option.value === tag.value)
        )
        .forEach((tag) => {
          const option: ColumnOption = {
            label: tag.label,
            value: tag.value,
            color: Db.coreFns.colors.randomColor(),
          };
          columnActions.addOptionToColumn(tableColumn, option);
        });
    }
  };
  const handleClickAway = () => {
    setShowSelectTags(false);
  };

  function TagsForm() {
    const tagsProps = {
      defaultValue: defaultValue,
      closeMenuOnSelect: false,
      isSearchable: true,
      isMulti: true,
      autoFocus: true,
      openMenuOnFocus: true,
      menuPosition: "fixed" as const,
      styles: CustomTagsStyles,
      options: columnOptions,
      onChange: handleOnChange,
      menuPortalTarget: activeDocument.body,
      className: `react-select-container ${c(
        "tags-container text-align-center"
      )}`,
      classNamePrefix: "react-select",
      menuPlacement: "auto" as const,
      menuShouldBlockScroll: true,
    };
    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className={c("tags")}>
          {tableColumn.config.option_source === OptionSource.MANUAL ? (
            <CreatableSelect
              {...tagsProps}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
            />
          ) : (
            <Select
              {...tagsProps}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
            />
          )}
        </div>
      </ClickAwayListener>
    );
  }
  return (
    <>
      {showSelectTags ? (
        <TagsForm />
      ) : (
        <div
          className={c(
            getAlignmentClassname(
              tableColumn.config,
              configInfo.getLocalSettings(),
              ["tabIndex", "tags-container"]
            )
          )}
          onDoubleClick={() => setShowSelectTags(true)}
          style={{ width: column.getSize() }}
          key={`tags-${row.index}-${tableColumn.key}`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setShowSelectTags(true);
            }
          }}
          tabIndex={0}
        >
          {tagsCell ? (
            tagsCell
              .sort((a: string, b: string) => a.localeCompare(b))
              .map((tag: string) => (
                <div key={`key-${tag}`}>
                  <Relationship
                    key={`tags-${row.index}-${tableColumn.key}-${tag}`}
                    option={mapOption(tag)}
                    view={view}
                  />
                </div>
              ))
          ) : (
            <span />
          )}
        </div>
      )}
    </>
  );
};
export default TagsCell;
