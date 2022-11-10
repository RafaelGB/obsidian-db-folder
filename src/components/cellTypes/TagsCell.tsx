import {
  RowSelectOption,
  CellComponentProps,
  SelectValue,
} from "cdm/ComponentsModel";
import Relationship from "components/RelationShip";
import CustomTagsStyles from "components/styles/TagsStyles";
import CreatableSelect from "react-select/creatable";
import { randomColor } from "helpers/Colors";
import React, { useMemo, useState } from "react";
import { ActionMeta, OnChangeValue } from "react-select";
import { c } from "helpers/StylesHelper";
import { TableColumn } from "cdm/FolderModel";
import { ParseService } from "services/ParseService";
import { InputType } from "helpers/Constants";

const TagsCell = (tagsProps: CellComponentProps) => {
  const { defaultCell } = tagsProps;
  const { row, column, table } = defaultCell;
  const { tableState } = table.options.meta;
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

  function getColor(tag: string) {
    const match = tableColumn.options.find(
      (option: { label: string }) => option.label === tag
    );
    if (match) {
      return match.backgroundColor;
    } else {
      // In case of new tag, generate random color
      const color = randomColor();
      columnActions.addOptionToColumn(tableColumn, tag, color);
      return color;
    }
  }

  // Control re renders with useCallback
  const defaultValue = useMemo(() => {
    const optionList = tagsCell || [];
    return optionList.map((tag: string) => ({
      label: tag,
      value: tag,
      color: getColor(tag),
    }));
  }, [tagsCell]);

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
    [tagsCell]
  );

  const handleOnChange = async (
    newValue: OnChangeValue<SelectValue, true>,
    actionMeta: ActionMeta<RowSelectOption>
  ) => {
    const arrayTags = newValue.map((tag) => `${tag.value}`);
    const newCell = ParseService.parseRowToLiteral(
      tagsRow,
      tableColumn,
      arrayTags
    );

    // Update on disk & memory
    await dataActions.updateCell(
      row.index,
      tableColumn,
      newCell,
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
          className={`react-select-container ${c(
            "tags-container text-align-center"
          )}`}
          classNamePrefix="react-select"
          menuPlacement="auto"
          menuShouldBlockScroll={true}
        />
      </div>
    );
  }
  return (
    <>
      {showSelectTags ? (
        TagsForm()
      ) : (
        <div
          className={c("tags-container text-align-center")}
          onClick={() => setShowSelectTags(true)}
          style={{ width: column.getSize() }}
          key={`tags-${row.index}-${tableColumn.key}`}
        >
          {tagsCell ? (
            tagsCell
              .sort((a: string, b: string) => a.localeCompare(b))
              .map((tag: string) => (
                <div key={`key-${tag}`}>
                  <Relationship
                    key={`tags-${row.index}-${tableColumn.key}-${tag}`}
                    value={tag.toString()}
                    backgroundColor={getColor(tag)}
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
