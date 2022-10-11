import Relationship from "components/RelationShip";
import { grey, randomColor } from "helpers/Colors";
import React, { useState } from "react";
import { CellComponentProps, RowSelectOption } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import CreatableSelect from "react-select/creatable";
import CustomTagsStyles from "components/styles/TagsStyles";
import { c } from "helpers/StylesHelper";
import { ActionMeta, OnChangeValue } from "react-select";
import { ParseService } from "services/ParseService";
import { InputType } from "helpers/Constants";

const SelectCell = (popperProps: CellComponentProps) => {
  const { defaultCell } = popperProps;
  const { row, column, table } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const dataActions = tableState.data((state) => state.actions);

  const selectRow = tableState.data((state) => state.rows[row.index]);
  const columnsInfo = tableState.columns((state) => state.info);
  const configInfo = tableState.configState((state) => state.info);
  const selectCell = tableState.data(
    (state) =>
      ParseService.parseRowToCell(
        state.rows[row.index],
        tableColumn,
        InputType.SELECT,
        configInfo.getLocalSettings()
      ) as string
  );

  const [showSelect, setShowSelect] = useState(false);

  const columnActions = table.options.meta.tableState.columns(
    (state) => state.actions
  );

  function getColor() {
    const match = tableColumn.options.find(
      (option: { label: string }) => option.label === selectCell
    );
    return (match && match.backgroundColor) || grey(200);
  }

  const defaultValue = {
    label: selectCell?.toString(),
    value: selectCell?.toString(),
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
    const newCell = ParseService.parseRowToLiteral(
      selectRow,
      tableColumn,
      newValue ? newValue.value : ""
    );
    // Update on disk & memory
    dataActions.updateCell(
      row.index,
      tableColumn,
      newCell,
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
          className={`react-select-container ${c(
            "tags-container text-align-center"
          )}`}
          classNamePrefix="react-select"
          key={`${tableColumn.id}-select-open`}
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
          className={`${c("text-align-center")}`}
          onClick={() => setShowSelect(true)}
          style={{ width: column.getSize() }}
        >
          {selectCell && (
            <Relationship
              value={selectCell.toString()}
              backgroundColor={getColor()}
            />
          )}
        </div>
      )}
    </>
  );
};

export default SelectCell;
