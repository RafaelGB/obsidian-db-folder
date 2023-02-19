import Relationship from "components/RelationShip";
import React, { useMemo, useState } from "react";
import {
  CellComponentProps,
  ColumnOption,
  SelectValue,
} from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import CustomTagsStyles from "components/styles/TagsStyles";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { satinizedColumnOption } from "helpers/FileManagement";
import { ActionMeta, OnChangeValue } from "react-select";
import { ParseService } from "services/ParseService";
import { InputType, OptionSource } from "helpers/Constants";
import { Db } from "services/CoreService";

const SelectCell = (popperProps: CellComponentProps) => {
  const { defaultCell } = popperProps;
  const { row, column, table } = defaultCell;
  const { tableState, view } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const dataActions = tableState.data((state) => state.actions);

  const selectRow = tableState.data((state) => state.rows[row.index]);
  const columnsInfo = tableState.columns((state) => state.info);
  const configInfo = tableState.configState((state) => state.info);
  const cellValue = tableState.data(
    (state) =>
      ParseService.parseRowToCell(
        state.rows[row.index],
        tableColumn,
        InputType.SELECT,
        configInfo.getLocalSettings()
      ) as string
  );

  const [showSelect, setShowSelect] = useState(false);

  const columnActions = tableState.columns((state) => state.actions);
  const columnOptions = columnsInfo.getColumnOptions(column.id);
  function mapOption() {
    const match = columnOptions.find((option) => option.value === cellValue);
    if (match) {
      return match;
    } else {
      // In case of new select, generate random color
      const option: ColumnOption = {
        label: cellValue,
        value: cellValue,
        color: Db.coreFns.colors.randomColor(),
      };
      columnActions.addOptionToColumn(tableColumn, option);
      return option;
    }
  }

  const defaultValue = useMemo(() => mapOption(), [cellValue]);

  const handleOnChange = async (
    newValue: OnChangeValue<SelectValue, false>,
    actionMeta: ActionMeta<ColumnOption>
  ) => {
    const sanitized = satinizedColumnOption(
      newValue ? newValue.value.toString() : ""
    );

    const newCell = ParseService.parseRowToLiteral(
      selectRow,
      tableColumn,
      sanitized
    );

    // Update on disk & memory
    await dataActions.updateCell({
      rowIndex: row.index,
      column: tableColumn,
      value: newCell,
      columns: columnsInfo.getAllColumns(),
      ddbbConfig: configInfo.getLocalSettings(),
      isMovingFile: true,
    });

    // Add new option to column options
    if (actionMeta.action === "create-option") {
      const option: ColumnOption = {
        label: sanitized,
        value: sanitized,
        color: Db.coreFns.colors.randomColor(),
      };

      await columnActions.addOptionToColumn(tableColumn, option);
    }
  };

  const options = columnsInfo.getColumnOptions(column.id, cellValue !== "");

  function SelectComponent() {
    const selectProps = {
      defaultValue: defaultValue,
      isSearchable: true,
      autoFocus: true,
      isClearable: true,
      openMenuOnFocus: true,
      menuPosition: "fixed" as const,
      styles: CustomTagsStyles,
      options: options,
      onMenuClose: () => setShowSelect(false),
      onChange: handleOnChange,
      isMulti: false,
      menuPortalTarget: activeDocument.body,
      menuPlacement: "auto" as const,
      menuShouldBlockScroll: true,
      className: `react-select-container ${c(
        "tags-container text-align-center"
      )}`,
      classNamePrefix: "react-select",
      key: `${tableColumn.id}-select-open`,
    };
    return (
      <div className={c("tags")}>
        {tableColumn.config.option_source === OptionSource.MANUAL ? (
          <CreatableSelect
            {...selectProps}
            defaultValue={defaultValue}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              ClearIndicator: () => null,
              CrossIcon: () => null,
            }}
          />
        ) : (
          <Select
            {...selectProps}
            defaultValue={defaultValue}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              ClearIndicator: () => null,
              CrossIcon: () => null,
            }}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {showSelect ? (
        <SelectComponent />
      ) : (
        /* Current value of the select */
        <div
          className={c(
            getAlignmentClassname(
              tableColumn.config,
              configInfo.getLocalSettings(),
              ["tabIndex"]
            )
          )}
          onDoubleClick={() => setShowSelect(true)}
          style={{ width: column.getSize() }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setShowSelect(true);
            }
          }}
          tabIndex={0}
        >
          {cellValue ? (
            <Relationship option={defaultValue} view={view} />
          ) : null}
        </div>
      )}
    </>
  );
};

export default SelectCell;
