import React, { useEffect, useReducer } from "react";
import update from "immutability-helper";
import {
  ActionTypes,
  InputType,
  DEFAULT_COLUMN_CONFIG,
  MetadataColumns,
  TableColumnsTemplate,
  UpdateRowOptions,
} from "helpers/Constants";
import { TableColumn, TableDataType, RowDataType } from "cdm/FolderModel";
import { LOGGER } from "services/Logger";
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

export function databaseReducer(state: TableDataType, action: any) {
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
      const optionIndex = state.view.columns.findIndex(
        (column: TableColumn) => column.id === action.columnId
      );
      const newOption: RowSelectOption = {
        label: action.option,
        backgroundColor: action.backgroundColor,
      };

      state.view.columns[optionIndex].options.push(newOption);
      state.view.diskConfig.updateColumnProperties(action.columnId, {
        options: state.view.columns[optionIndex].options,
      });

      return update(state, {
        view: {
          columns: {
            [optionIndex]: {
              options: {
                $set: state.view.columns[optionIndex].options,
              },
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
      state.view.columns
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
        __note__: new NoteInfo({
          ...rowRecord.frontmatter,
          ...rowRecord.inline,
          file: { path: filename },
        }),
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
      const update_column_label_index = state.view.columns.findIndex(
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
        view: {
          columns: {
            $set: [
              ...state.view.columns.slice(0, update_column_label_index),
              {
                ...state.view.columns[update_column_label_index],
                label: action.label,
                id: action.newKey,
                key: action.newKey,
                accessorKey: action.newKey,
              },
              ...state.view.columns.slice(
                update_column_label_index + 1,
                state.view.columns.length
              ),
            ],
          },
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
      const typeIndex = state.view.columns.findIndex(
        (column) => column.id === action.columnId
      );
      /** Check if type is changed */
      if (state.view.columns[typeIndex].input === action.input) {
        return state;
      }
      /** If changed, then parsed information */
      // Update configuration on disk
      state.view.diskConfig.updateColumnProperties(action.columnId, {
        input: action.input,
      });
      // Parse data
      const parsedData = state.view.rows.map((row: any) => ({
        ...row,
        [action.columnId]: DataviewService.parseLiteral(
          row[action.columnId],
          action.input, // Destination type to parse
          state.view.diskConfig.yaml.config
        ),
      }));
      // Update state
      switch (action.input) {
        case InputType.SELECT:
        case InputType.TAGS:
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
            view: {
              columns: {
                $set: [
                  ...state.view.columns.slice(0, typeIndex),
                  {
                    ...state.view.columns[typeIndex],
                    input: action.input,
                    options: obtainUniqueOptionValues(options),
                  },
                  ...state.view.columns.slice(
                    typeIndex + 1,
                    state.view.columns.length
                  ),
                ],
              },

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
            view: {
              columns: {
                $set: [
                  ...state.view.columns.slice(0, typeIndex),
                  { ...state.view.columns[typeIndex], input: action.input },
                  ...state.view.columns.slice(
                    typeIndex + 1,
                    state.view.columns.length
                  ),
                ],
              },

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
      const leftIndex = state.view.columns.findIndex(
        (column) => column.id === action.columnId
      );

      const newLeftColumn: DatabaseColumn = {
        input: InputType.TEXT,
        accessorKey: action.columnInfo.name,
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
        view: {
          columns: {
            $set: [
              ...state.view.columns.slice(0, leftIndex),
              {
                ...TableColumnsTemplate,
                input: newLeftColumn.input,
                id: newLeftColumn.key,
                label: newLeftColumn.label,
                key: newLeftColumn.key,
                accessorKey: newLeftColumn.accessorKey,
                position: newLeftColumn.position,
                csvCandidate: true,
                config: newLeftColumn.config,
              },
              ...state.view.columns.slice(leftIndex, state.view.columns.length),
            ],
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
     * Add new column to the table to the right of the column with the given id
     * and save it on disk
     */
    case ActionTypes.ADD_COLUMN_TO_RIGHT:
      const rightIndex = state.view.columns.findIndex(
        (column) => column.id === action.columnId
      );

      const newRIghtColumn: DatabaseColumn = {
        ...TableColumnsTemplate,
        accessorKey: action.columnInfo.name,
        key: action.columnInfo.name,
        label: action.columnInfo.label,
        position: action.columnInfo.position,
      };
      // Update configuration on disk
      state.view.diskConfig.addColumn(action.columnInfo.name, newRIghtColumn);

      return update(state, {
        skipReset: { $set: true },
        view: {
          // Add column visually to the right of the column with the given id
          columns: {
            $set: [
              ...state.view.columns.slice(0, rightIndex + 1),
              {
                ...TableColumnsTemplate,
                id: newRIghtColumn.key,
                label: newRIghtColumn.label,
                key: newRIghtColumn.key,
                accessorKey: newRIghtColumn.accessorKey,
                position: newRIghtColumn.position,
              },
              ...state.view.columns.slice(
                rightIndex + 1,
                state.view.columns.length
              ),
            ],
          },
          // Update view yaml

          diskConfig: {
            yaml: {
              $set: state.view.diskConfig.yaml,
            },
          },
        },
      });
    case ActionTypes.DELETE_COLUMN:
      const deleteIndex = state.view.columns.findIndex(
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
            ).catch((err) => {
              throw err;
            });
          })
        ).catch((err) => {
          throw err;
        });
      }
      // Update state
      return update(state, {
        skipReset: { $set: true },
        view: {
          columns: {
            $set: [
              ...state.view.columns.slice(0, deleteIndex),
              ...state.view.columns.slice(
                deleteIndex + 1,
                state.view.columns.length
              ),
            ],
          },

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

        action.row.original.__note__ = new NoteInfo({
          ...action.row,
          file: {
            path: auxPath,
          },
        });
        // Update original cell value
        const update_option_cell_index = state.view.columns.findIndex(
          (column) => column.id === action.columnId
        );
        const update_option_cell_column_key =
          state.view.columns[update_option_cell_index].key;
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
      const update_cell_index = state.view.columns.findIndex(
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
        state.view.columns[update_cell_index].key;
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

    /**
     * Update the configuration of a column
     */
    case ActionTypes.MODIFY_COLUMN_CONFIG:
      // Altern between inline & frontmatter mode
      state.view.diskConfig.updateColumnProperties(
        action.columnId,
        action.columnConfig
      );
      const toggleInlineIndex = state.view.columns.findIndex(
        (column) => column.id === action.columnId
      );

      return update(state, {
        skipReset: { $set: true },
        view: {
          columns: {
            [toggleInlineIndex]: {
              config: {
                $set: action.columnConfig,
              },
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
  }, [state.view.rows, state.view.columns]);

  return { state, dataDispatch };
}
