import React, { useEffect, useReducer } from "react";
import update from "immutability-helper";
import {
  ActionTypes,
  DataTypes,
  DEFAULT_COLUMN_CONFIG,
  MetadataColumns,
  TableColumnsTemplate,
  UpdateRowOptions,
} from "helpers/Constants";
import { TableColumn, TableDataType, RowDataType } from "cdm/FolderModel";
import { LOGGER } from "services/Logger";
import { ActionType } from "@tanstack/react-table";
import { VaultManagerDB } from "services/FileManagerService";
import { moveFile, updateRowFileProxy } from "helpers/VaultManagement";
import { randomColor } from "helpers/Colors";
import {
  DatabaseColumn,
  OptionSelect,
  RowDatabaseFields,
  SortedType,
} from "cdm/DatabaseModel";
import NoteInfo from "services/NoteInfo";
import { DataviewService } from "services/DataviewService";
import { obtainUniqueOptionValues } from "helpers/SelectHelper";
import { Literal } from "obsidian-dataview/lib/data-model/value";
import { DateTime } from "luxon";
import { RowSelectOption } from "cdm/ComponentsModel";

export function databaseReducer(state: TableDataType, action: ActionType) {
  LOGGER.debug(`<=>databaseReducer action: ${action.type}`, action);
  /** database configuration */
  const dbconfig = state.view.diskConfig.yaml.config;
  // Check if action exists
  if (!action) {
    return state;
  }
  switch (action.type) {
    /**
     * Add option to column
     */
    case ActionTypes.ADD_OPTION_TO_COLUMN:
      const optionIndex = state.columns.findIndex(
        (column: TableColumn) => column.id === action.columnId
      );
      const newOption: RowSelectOption = {
        label: action.option,
        backgroundColor: action.backgroundColor,
      };
      state.columns[optionIndex].options.push(newOption);
      state.view.diskConfig.updateColumnProperties(action.columnId, {
        options: state.columns[optionIndex].options,
      });

      return update(state, {
        columns: {
          [optionIndex]: {
            options: {
              $set: state.columns[optionIndex].options,
            },
          },
        },
      });
    /**
     * Add new row into table
     */
    case ActionTypes.ADD_ROW:
      const filename = `${state.view.file.parent.path}/${action.filename}.md`;
      const rowRecord: RowDatabaseFields = { inline: {}, frontmatter: {} };
      state.columns
        .filter((column: TableColumn) => !column.isMetadata)
        .forEach((column: TableColumn) => {
          if (column.config.isInline) {
            rowRecord.inline[column.key] = "";
          } else {
            rowRecord.frontmatter[column.key] = "";
          }
        });
      // Add note to persist row
      VaultManagerDB.create_markdown_file(
        state.view.file.parent,
        action.filename,
        rowRecord,
        state.view.diskConfig.yaml.config
      );
      const metadata: Record<string, Literal> = {};
      metadata[MetadataColumns.CREATED] = DateTime.now();
      metadata[MetadataColumns.MODIFIED] = DateTime.now();
      metadata[MetadataColumns.TASKS] = ""; // Represents the tasks for the row as empty
      const row: RowDataType = {
        ...rowRecord.frontmatter,
        ...rowRecord.inline,
        ...metadata,
        id: state.view.rows.length + 1,
        __note__: new NoteInfo(
          {
            ...rowRecord.frontmatter,
            ...rowRecord.inline,
            file: { path: filename },
          },
          state.view.rows.length + 1
        ),
        [MetadataColumns.FILE]: `[[${filename}|${action.filename}]]`,
      };
      // TODO add typing
      return update(state, {
        view: {
          rows: { $push: [row] },
        },
      });
    /**
     * Add new row into table
     */
    case ActionTypes.CHANGE_ROW_TEMPLATE:
      state.view.diskConfig.updateConfig(
        "current_row_template",
        action.template
      );
      return update(state, {
        view: {
          diskConfig: {
            yaml: {
              config: {
                current_row_template: {
                  $set: action.template,
                },
              },
            },
          },
        },
      });
    /**
     * Modify column label of its header.
     * Update key of column in all rows
     */
    case ActionTypes.UPDATE_COLUMN_LABEL:
      const update_column_label_index = state.columns.findIndex(
        (column: any) => column.id === action.columnId
      );
      // Update configuration & row files on disk
      state.view.diskConfig.updateColumnKey(
        action.columnId,
        action.newKey,
        action.label
      );
      Promise.all(
        state.view.rows.map(async (row: RowDataType) => {
          await updateRowFileProxy(
            row.__note__.getFile(),
            action.columnId,
            action.newKey,
            state,
            UpdateRowOptions.COLUMN_KEY
          );
        })
      );

      return update(state, {
        skipReset: { $set: true },
        // Modify column visually with the new label
        columns: {
          $set: [
            ...state.columns.slice(0, update_column_label_index),
            {
              ...state.columns[update_column_label_index],
              label: action.label,
              id: action.newKey,
              key: action.newKey,
              accessor: action.newKey,
            },
            ...state.columns.slice(
              update_column_label_index + 1,
              state.columns.length
            ),
          ],
        },
        view: {
          // Modify data visually with the new key
          rows: {
            $set: state.view.rows.map((row: RowDataType) => {
              row[action.newKey] = row[action.columnId];
              delete row[action.columnId];
              return row;
            }),
          },
          // Update view yaml state
          diskConfig: {
            yaml: {
              $set: state.view.diskConfig.yaml,
            },
          },
        },
      });

    /**
     * Modify type of column and adapt the data.
     * Update type on disk
     */
    case ActionTypes.UPDATE_COLUMN_TYPE:
      const typeIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      /** Check if type is changed */
      if (state.columns[typeIndex].dataType === action.dataType) {
        return state;
      }
      /** If changed, then parsed information */
      // Update configuration on disk
      state.view.diskConfig.updateColumnProperties(action.columnId, {
        input: action.dataType,
      });
      // Parse data
      const parsedData = state.view.rows.map((row: any) => ({
        ...row,
        [action.columnId]: DataviewService.parseLiteral(
          row[action.columnId],
          action.dataType, // Destination type to parse
          state.view.diskConfig.yaml.config
        ),
      }));
      // Update state
      switch (action.dataType) {
        case DataTypes.SELECT:
        case DataTypes.TAGS:
          const options: OptionSelect[] = [];
          // Generate selected options
          parsedData.forEach((row) => {
            if (row[action.columnId]) {
              options.push({
                label: row[action.columnId],
                backgroundColor: randomColor(),
              });
            }
          });
          // Update column to SELECT type
          return update(state, {
            skipReset: { $set: true },
            columns: {
              $set: [
                ...state.columns.slice(0, typeIndex),
                {
                  ...state.columns[typeIndex],
                  dataType: action.dataType,
                  options: obtainUniqueOptionValues(options),
                },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
            },
            view: {
              // Update data associated to column
              rows: {
                $set: parsedData,
              },
            },
          });
        default:
          /**
           * GENERIC update change
           * Update column dataType & parsed data
           * Aplied to:
           * - TEXT
           * - NUMBER
           * - CALENDAR
           * - CALENDAR_TIME
           * - CHECKBOX
           */
          return update(state, {
            skipReset: { $set: true },
            columns: {
              $set: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
            },
            view: {
              rows: {
                $set: parsedData,
              },
            },
          });
      }
    /**
     * Add new column to the table to the left of the column with the given id
     * and save it on disk
     */
    case ActionTypes.ADD_COLUMN_TO_LEFT:
      const leftIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );

      const newLeftColumn: DatabaseColumn = {
        input: DataTypes.TEXT,
        accessor: action.columnInfo.name,
        key: action.columnInfo.name,
        label: action.columnInfo.label,
        position: action.columnInfo.position,
        config: DEFAULT_COLUMN_CONFIG,
      };
      // Update configuration on disk
      state.view.diskConfig.addColumn(action.columnInfo.name, newLeftColumn);
      // Update state
      return update(state, {
        skipReset: { $set: true },
        columns: {
          $set: [
            ...state.columns.slice(0, leftIndex),
            {
              ...TableColumnsTemplate,
              dataType: newLeftColumn.input,
              id: newLeftColumn.accessor,
              label: newLeftColumn.label,
              key: newLeftColumn.key,
              accessor: newLeftColumn.accessor,
              position: newLeftColumn.position,
              csvCandidate: true,
              config: newLeftColumn.config,
            },
            ...state.columns.slice(leftIndex, state.columns.length),
          ],
        },
        // Update view yaml
        view: {
          diskConfig: {
            yaml: {
              $set: state.view.diskConfig.yaml,
            },
          },
        },
      });
    /**
     * Add new column to the table to the right of the column with the given id
     * and save it on disk
     */
    case ActionTypes.ADD_COLUMN_TO_RIGHT:
      const rightIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );

      const newRIghtColumn: DatabaseColumn = {
        input: DataTypes.TEXT,
        accessor: action.columnInfo.name,
        key: action.columnInfo.name,
        label: action.columnInfo.label,
        position: action.columnInfo.position,
        config: DEFAULT_COLUMN_CONFIG,
      };
      // Update configuration on disk
      state.view.diskConfig.addColumn(action.columnInfo.name, newRIghtColumn);

      return update(state, {
        skipReset: { $set: true },
        // Add column visually to the right of the column with the given id
        columns: {
          $set: [
            ...state.columns.slice(0, rightIndex + 1),
            {
              ...TableColumnsTemplate,
              dataType: newRIghtColumn.input,
              id: newRIghtColumn.accessor,
              label: newRIghtColumn.label,
              key: newRIghtColumn.key,
              accessor: newRIghtColumn.accessor,
              position: newRIghtColumn.position,
              csvCandidate: true,
              config: newRIghtColumn.config,
            },
            ...state.columns.slice(rightIndex + 1, state.columns.length),
          ],
        },
        // Update view yaml
        view: {
          diskConfig: {
            yaml: {
              $set: state.view.diskConfig.yaml,
            },
          },
        },
      });
    case ActionTypes.DELETE_COLUMN:
      const deleteIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      // Update configuration on disk
      state.view.diskConfig.removeColumn(action.columnId);
      if (state.view.diskConfig.yaml.config.remove_field_when_delete_column) {
        Promise.all(
          state.view.rows.map(async (row: RowDataType) => {
            updateRowFileProxy(
              row.__note__.getFile(),
              action.key,
              undefined, // delete does not need this field
              state,
              UpdateRowOptions.REMOVE_COLUMN
            );
          })
        );
      }
      // Update state
      return update(state, {
        skipReset: { $set: true },
        columns: {
          $set: [
            ...state.columns.slice(0, deleteIndex),
            ...state.columns.slice(deleteIndex + 1, state.columns.length),
          ],
        },
        view: {
          // Update data associated to column
          rows: {
            $set: state.view.rows.map((row) => {
              const newRow = { ...row };
              delete newRow[action.columnId];
              return newRow;
            }),
          },
          // Update view yaml
          diskConfig: {
            yaml: {
              $set: state.view.diskConfig.yaml,
            },
          },
        },
      });
    /**
     * Check if the given option cell is a candidate for moving the file into a subfolder
     */
    case ActionTypes.UPDATE_OPTION_CELL:
      // check if this column is configured as a group folder
      if (dbconfig.group_folder_column === action.key) {
        moveFile(`${state.view.file.parent.path}/${action.value}`, action);
        action.row[
          MetadataColumns.FILE
        ] = `[[${state.view.file.parent.path}/${action.value}/${action.file.name}|${action.file.basename}]]`;
        // Check if action.value is a valid folder name
        const auxPath =
          action.value !== ""
            ? `${state.view.file.parent.path}/${action.value}/${action.file.name}`
            : `${state.view.file.parent.path}/${action.file.name}`;

        action.row.original.__note__ = new NoteInfo(
          {
            ...action.row,
            file: {
              path: auxPath,
            },
          },
          action.row.index
        );
        // Update original cell value
        const update_option_cell_index = state.columns.findIndex(
          (column) => column.id === action.columnId
        );
        const update_option_cell_column_key =
          state.columns[update_option_cell_index].key;
        return update(state, {
          view: {
            rows: {
              [action.row.index]: {
                $merge: {
                  [MetadataColumns.FILE]: action.row[MetadataColumns.FILE],
                  note: action.row.original.__note__,
                  [update_option_cell_column_key]: action.value,
                },
              },
            },
          },
        });
      }
    // Otherwise, update the value of the cell using the normal update method
    /**
     * Update the value of a cell in the table and save it on disk
     */
    case ActionTypes.UPDATE_CELL:
      // Obtain current column index
      const update_cell_index = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      // Save on disk
      updateRowFileProxy(
        action.file,
        action.key,
        action.value,
        state,
        UpdateRowOptions.COLUMN_VALUE
      );

      const update_option_cell_column_key =
        state.columns[update_cell_index].key;
      return update(state, {
        view: {
          rows: {
            [action.row.index]: {
              $merge: {
                [update_option_cell_column_key]: action.value,
              },
            },
          },
        },
      });
    /**
     * Enable reset
     */
    case ActionTypes.ENABLE_RESET:
      return update(state, { skipReset: { $set: false } });

    case ActionTypes.SET_SORT_BY:
      const sortArray: SortedType[] = action.sortArray;
      const modifiedColumns: TableColumn[] = state.columns.map((column) => {
        const sortedColumn = sortArray.find((sort) => sort.id === column.id);
        if (sortedColumn) {
          column.isSorted = true;
          column.isSortedDesc = sortedColumn.desc;
        } else {
          column.isSorted = false;
        }
        return column;
      });
      state.initialState.sortBy = action.sortArray;
      return update(state, {
        columns: {
          $set: modifiedColumns,
        },
        initialState: {
          $set: state.initialState,
        },
      });

    // case ActionTypes.MODIFY_COLUMN_SORTING:
    case ActionTypes.MODIFY_COLUMN_CONFIG:
      // Altern between inline & frontmatter mode
      state.view.diskConfig.updateColumnProperties(
        action.columnId,
        action.columnConfig
      );
      const toggleInlineIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );

      return update(state, {
        skipReset: { $set: true },
        columns: {
          [toggleInlineIndex]: {
            config: {
              $set: action.columnConfig,
            },
          },
        },
      });

    default:
      LOGGER.warn(`<=> databaseReducer: unknown action ${action.type}`);
  }
  return state;
}

export function getDispatch(tableData: TableDataType) {
  const [state, dataDispatch] = useReducer(databaseReducer, tableData);

  useEffect(() => {
    dataDispatch({ type: ActionTypes.ENABLE_RESET });
  }, [state.view.rows, state.columns]);

  return { state, dataDispatch };
}
