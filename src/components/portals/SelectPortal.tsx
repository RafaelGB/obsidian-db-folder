import Relationship from "components/RelationShip";
import { grey, randomColor } from "helpers/Colors";
import React, { useState } from "react";
import { CellComponentProps, RowSelectOption } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import CreatableSelect from "react-select/creatable";
import CustomTagsStyles from "components/styles/TagsStyles";
import { c } from "helpers/StylesHelper";
import { ActionMeta, OnChangeValue } from "react-select";

const SelectPortal = (popperProps: CellComponentProps) => {
  const { defaultCell } = popperProps;
  const { row, column, table } = defaultCell;
  const { tableState } = table.options.meta;
  const dataActions = tableState.data((state) => state.actions);

  const selectPortalRow = tableState.data((state) => state.rows[row.index]);
  const columnsInfo = tableState.columns((state) => state.info);
  const configInfo = tableState.configState((state) => state.info);

  const tableColumn = column.columnDef as TableColumn;

  const [showSelect, setShowSelect] = useState(false);

  const columnActions = table.options.meta.tableState.columns(
    (state) => state.actions
  );

  function getColor() {
    const match = tableColumn.options.find(
      (option: { label: string }) =>
        option.label === selectPortalRow[tableColumn.key]
    );
    return (match && match.backgroundColor) || grey(200);
  }

  const defaultValue = {
    label: selectPortalRow[tableColumn.key]?.toString(),
    value: selectPortalRow[tableColumn.key]?.toString(),
    color: getColor(),
  };

  const multiOptions = tableColumn.options
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((option: RowSelectOption) => ({
      value: option.label,
      label: option.label,
      color: option.backgroundColor,
    }));

  const handleOnChange = (
    newValue: OnChangeValue<any, false>,
    actionMeta: ActionMeta<RowSelectOption>
  ) => {
    const selection = newValue ? newValue.value : "";
    // Update on disk & memory
    dataActions.updateCell(
      row.index,
      tableColumn,
      selection,
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings(),
      true
    );
    // Add new option to column options

    if (
      newValue.value &&
      !tableColumn.options.find((option) => option.label === newValue.value)
    ) {
      columnActions.addOptionToColumn(
        tableColumn,
        newValue.value,
        randomColor()
      );
    }
    setShowSelect(false);
  };

  function SelectComponent() {
    return (
      <div className={c("tags")}>
        <CreatableSelect
          defaultValue={defaultValue}
          isSearchable
          autoFocus
          isClearable
          openMenuOnFocus
          menuPosition="fixed"
          styles={CustomTagsStyles}
          options={multiOptions}
          onBlur={() => setShowSelect(false)}
          onChange={handleOnChange}
          menuPortalTarget={activeDocument.body}
          menuPlacement="auto"
          menuShouldBlockScroll={true}
          className={c("text-align-center")}
          key={`${tableColumn.key}-select-open`}
        />
      </div>
    );
  }

  return (
    <>
      {showSelect ? (
        SelectComponent()
      ) : (
        /* Current value of the select */
        <div
          className={`cell-padding d-flex ${c("text-align-center")}`}
          onClick={() => setShowSelect(true)}
          style={{ width: column.getSize() }}
        >
          {selectPortalRow[tableColumn.key] && (
            <Relationship
              value={selectPortalRow[tableColumn.key]?.toString()}
              backgroundColor={getColor()}
            />
          )}
        </div>
      )}
    </>
  );
};

export default SelectPortal;
