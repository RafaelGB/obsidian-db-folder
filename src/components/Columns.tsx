import {
  DataTypes,
  MetadataColumns,
  MetadataDatabaseColumns,
} from "helpers/Constants";
import { TableColumn } from "cdm/FolderModel";
import { LOGGER } from "services/Logger";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { RowSelectOption } from "cdm/RowSelectModel";
import { dbTrim } from "helpers/StylesHelper";

/**
 * Add mandatory columns to the table
 * @param columns
 * @returns
 */
export async function obtainMetadataColumns(): Promise<TableColumn[]> {
  const columns: TableColumn[] = [];
  const metadataColumns: Record<string, DatabaseColumn> = {};
  metadataColumns[MetadataColumns.FILE] = MetadataDatabaseColumns.FILE;
  metadataColumns[MetadataColumns.ADD_COLUMN] =
    MetadataDatabaseColumns.ADD_COLUMN;

  await Promise.all(
    Object.keys(metadataColumns).map(async (columnKey, index) => {
      const column = metadataColumns[columnKey];
      columns.push(await columnOptions(columnKey, index, column));
    })
  );
  return columns;
}

export async function obtainColumnsFromFolder(
  databaseColumns: Record<string, DatabaseColumn>
): Promise<TableColumn[]> {
  LOGGER.debug(
    `=> obtainColumnsFromFolder. databaseColumns: ${JSON.stringify(
      databaseColumns
    )}`
  );
  const columns: TableColumn[] = [];
  await Promise.all(
    Object.keys(databaseColumns).map(async (columnKey, index) => {
      const column = databaseColumns[columnKey];
      columns.push(await columnOptions(columnKey, index, column));
    })
  );
  LOGGER.debug(`<= obtainColumnsFromFolder(. return ${columns.length} columns`);
  return sortColumnsByPosition(columns);
}

async function columnOptions(
  columnKey: string,
  index: number,
  column: DatabaseColumn
): Promise<TableColumn> {
  LOGGER.debug(`=> columnOptions. column: ${JSON.stringify(column)}`);
  const options: RowSelectOption[] = [];
  const tableRow: TableColumn = {
    id: columnKey,
    position: column.position ?? index,
    label: column.label,
    key: column.key ?? columnKey,
    accessor: column.accessor ?? dbTrim(column.label),
    isMetadata: column.isMetadata ?? false,
    csvCandidate: column.csvCandidate ?? true,
  };
  /**
   * return plain text
   * @returns {TableColumn}
   */
  function isText(): TableColumn {
    LOGGER.debug(`<= columnOptions`, `return text column`);
    return {
      ...tableRow,
      dataType: DataTypes.TEXT,
      options: options,
    };
  }

  /**
   * return number
   * @returns {TableColumn}
   */
  function isNumber(): TableColumn {
    LOGGER.debug(`<= columnOptions`, `return number column`);
    return {
      ...tableRow,
      dataType: DataTypes.NUMBER,
      options: options,
    };
  }
  /**
   * return selector
   * @returns {TableColumn}
   */
  function isSelect(): TableColumn {
    LOGGER.debug(`<= columnOptions`, `return select column`);
    return {
      ...tableRow,
      dataType: DataTypes.SELECT,
      options: options,
    };
  }

  /**
   * return markdown rendered text
   * @returns {TableColumn}
   */
  function isMarkdown(): TableColumn {
    LOGGER.debug(`<= columnOptions`, `return markdown column`);
    return {
      ...tableRow,
      dataType: DataTypes.MARKDOWN,
      options: options,
    };
  }

  function isNewColumn(): TableColumn {
    LOGGER.debug(`<= columnOptions`, `return new column`);
    return {
      ...tableRow,
      dataType: DataTypes.NEW_COLUMN,
      options: options,
    };
  }

  // Record of options
  let inputs: Record<string, any> = {};
  inputs[DataTypes.TEXT] = isText;
  inputs[DataTypes.NUMBER] = isNumber;
  inputs[DataTypes.SELECT] = isSelect;
  inputs[DataTypes.MARKDOWN] = isMarkdown;
  inputs[DataTypes.NEW_COLUMN] = isNewColumn;
  if (inputs.hasOwnProperty(column.input)) {
    return await inputs[column.input]();
  } else {
    throw `Error: option ${column.input} not supported yet`;
  }
}

function sortColumnsByPosition(columns: TableColumn[]): TableColumn[] {
  return columns.sort((a, b) => {
    if (a.position < b.position) {
      return -1;
    } else if (a.position > b.position) {
      return 1;
    } else {
      return 0;
    }
  });
}
