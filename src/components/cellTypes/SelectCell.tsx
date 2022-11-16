import Relationship from "components/RelationShip";
import { grey, randomColor } from "helpers/Colors";
import React, { useMemo, useState } from "react";
import {
  CellComponentProps,
  RowSelectOption,
  SelectValue,
} from "cdm/ComponentsModel";
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

  const columnActions = tableState.columns((state) => state.actions);

  function getColor() {
    const match = tableColumn.options.find(
      (option: { label: string }) => option.label === selectCell
    );
    if (match) {
      return match.backgroundColor;
    } else {
      // In case of new select, generate random color
      const color = randomColor();
      columnActions.addOptionToColumn(tableColumn, selectCell, color);
      return color;
    }
  }

  const defaultValue = useMemo(
    () => ({
      label: selectCell?.toString(),
      value: selectCell?.toString(),
      color: selectCell ? getColor() : grey(200),
    }),
    [selectCell]
  );

  const multiOptions = useMemo(
    () =>
      tableColumn.options
        .filter(
          (option: RowSelectOption) =>
            option && option.label !== undefined && option.label !== null
        )
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((option: RowSelectOption) => ({
          value: option.label,
          label: option.label,
          color: option.backgroundColor,
        })),
    [selectRow]
  );

  const handleOnChange = async (
    newValue: OnChangeValue<SelectValue, false>,
    actionMeta: ActionMeta<RowSelectOption>
  ) => {
    const selectValue = newValue ? newValue.value.toString() : "";
    const newCell = ParseService.parseRowToLiteral(
      selectRow,
      tableColumn,
      selectValue
    );
    // Update on disk & memory
    dataActions.updateCell(
      row.index,
      tableColumn,
      newCell,
      columnsInfo.getAllColumns(),
      { ...configInfo.getLocalSettings(), frontmatter_quote_wrap: true },
      true
    );
    // Add new option to column options

    if (
      selectValue &&
      !tableColumn.options.find((option) => option.label === selectValue)
    ) {
      await columnActions.addOptionToColumn(
        tableColumn,
        selectValue,
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
          isMulti={false}
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
