import { RowSelectOption, CellComponentProps } from "cdm/ComponentsModel";
import Relationship from "components/RelationShip";
import CustomTagsStyles from "components/styles/TagsStyles";
import CreatableSelect from "react-select/creatable";
import { randomColor } from "helpers/Colors";
import React, { useState } from "react";
import { ActionMeta, OnChangeValue } from "react-select";
import { c } from "helpers/StylesHelper";
import { Literal } from "obsidian-dataview/lib/data-model/value";
import { TableColumn } from "cdm/FolderModel";

const TagsPortal = (tagsProps: CellComponentProps) => {
  const { defaultCell } = tagsProps;
  const { row, column, table } = defaultCell;
  const { tableState } = table.options.meta;
  const columnsInfo = tableState.columns((state) => state.info);
  const columnActions = tableState.columns((state) => state.actions);
  const dataActions = tableState.data((state) => state.actions);

  const tagsRow = tableState.data((state) => state.rows[row.index]);

  const configInfo = tableState.configState((state) => state.info);

  const tableColumn = column.columnDef as TableColumn;
  // Tags reference state
  const [showSelectTags, setShowSelectTags] = useState(false);
  // tags values state
  const tagsState = Array.isArray(tagsRow[tableColumn.key])
    ? (tagsRow[tableColumn.key] as Literal[])
    : [];

  function getColor(tag: string) {
    const match = tableColumn.options.find(
      (option: { label: string }) => option.label === tag
    );
    if (match) {
      return match.backgroundColor;
    } else {
      // In case of new tag, generate random color
      const color = randomColor();
      const newOption: RowSelectOption = {
        label: tag,
        backgroundColor: color,
      };
      const currentColumn = columnsInfo
        .getAllColumns()
        .find((col: TableColumn) => col.key === tableColumn.key);
      currentColumn.options.push(newOption);
      table.options.meta.view.diskConfig.updateColumnProperties(column.id, {
        options: currentColumn.options,
      });
      return color;
    }
  }

  const defaultValue = tagsState.map((tag: string) => ({
    label: tag,
    value: tag,
    color: getColor(tag),
  }));

  const multiOptions = tableColumn.options
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((option: RowSelectOption) => ({
      value: option.label,
      label: option.label,
      color: option.backgroundColor,
    }));

  const handleOnChange = (
    newValue: OnChangeValue<any, true>,
    actionMeta: ActionMeta<RowSelectOption>
  ) => {
    const arrayTags = newValue.map((tag: any) => tag.value);
    // Update on disk & memory
    dataActions.updateCell(
      row.index,
      tableColumn,
      arrayTags,
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings()
    );
    // Add new option to column options
    newValue
      .filter(
        (tag) =>
          !tableColumn.options.find((option) => option.label === tag.value)
      )
      .forEach((tag) => {
        columnActions.addOptionToColumn(tableColumn, tag.value, randomColor());
      });
  };

  function TagsForm() {
    return (
      <div className={c("tags")}>
        <CreatableSelect
          defaultValue={defaultValue}
          closeMenuOnSelect={false}
          isSearchable
          isMulti
          autoFocus
          openMenuOnFocus
          menuPosition="fixed"
          styles={CustomTagsStyles}
          options={multiOptions}
          onBlur={() => setShowSelectTags(false)}
          onChange={handleOnChange}
          menuPortalTarget={activeDocument.body}
          className={c("tags-container text-align-center")}
          menuPlacement="auto"
          menuShouldBlockScroll={true}
        />
      </div>
    );
  }
  return (
    <>
      {showSelectTags
        ? TagsForm()
        : tagsState && (
            <div
              className={c("tags-container text-align-center")}
              onClick={() => setShowSelectTags(true)}
              style={{ width: column.getSize() }}
            >
              {tagsState
                .sort((a: string, b: string) => a.localeCompare(b))
                .map((tag: string) => (
                  <div key={`key-${tag}`}>
                    <Relationship
                      key={`key-Relationship-${tag}`}
                      value={tag}
                      backgroundColor={getColor(tag)}
                    />
                  </div>
                ))}
            </div>
          )}
    </>
  );
};
export default TagsPortal;
