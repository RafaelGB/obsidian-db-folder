import {
  DataTypes,
  MaxCapacitiesDatabase,
  MetadataColumns,
  MetadataDatabaseColumns,
} from "helpers/Constants";
import { TableColumn } from "cdm/FolderModel";
import { LOGGER } from "services/Logger";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { RowSelectOption } from "cdm/RowSelectModel";
import { LocalSettings } from "cdm/SettingsModel";
import { dbTrim } from "helpers/StylesHelper";

/**
 * Add mandatory columns to the table
 * @param columns
 * @returns
 */
export async function obtainMetadataColumns(
  yamlColumns: Record<string, DatabaseColumn>,
  localSetting: LocalSettings
): Promise<Record<string, DatabaseColumn>> {
  // If File is not already in the table, add it
  yamlColumns[MetadataColumns.FILE] = {
    ...MetadataDatabaseColumns.FILE,
    ...(yamlColumns[MetadataColumns.FILE] ?? {}),
  };

  if (localSetting.show_metadata_created) {
    // If Created is not already in the table, add it
    yamlColumns[MetadataColumns.CREATED] = {
      ...MetadataDatabaseColumns.CREATED,
      ...(yamlColumns[MetadataColumns.CREATED] ?? {}),
    };
  } else {
    delete yamlColumns[MetadataColumns.CREATED];
  }

  if (localSetting.show_metadata_modified) {
    // If Modified is not already in the table, add it
    yamlColumns[MetadataColumns.MODIFIED] = {
      ...MetadataDatabaseColumns.MODIFIED,
      ...(yamlColumns[MetadataColumns.MODIFIED] ?? {}),
    };
  } else {
    delete yamlColumns[MetadataColumns.MODIFIED];
  }

  if (localSetting.show_metadata_tasks) {
    // If Modified is not already in the table, add it
    yamlColumns[MetadataColumns.TASKS] = {
      ...MetadataDatabaseColumns.TASKS,
      ...(yamlColumns[MetadataColumns.TASKS] ?? {}),
    };
  } else {
    delete yamlColumns[MetadataColumns.TASKS];
  }

  yamlColumns[MetadataColumns.ADD_COLUMN] = {
    ...MetadataDatabaseColumns.ADD_COLUMN,
    position: MaxCapacitiesDatabase.MAX_COLUMNS + 1,
  };
  return yamlColumns;
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

function columnOptions(
  columnKey: string,
  index: number,
  column: DatabaseColumn
): TableColumn {
  LOGGER.debug(`=> columnOptions. column: ${JSON.stringify(column)}`);
  const options: RowSelectOption[] = column.options ?? [];
  if ((Object.values(DataTypes) as Array<string>).includes(column.input)) {
    LOGGER.debug(`<= columnOptions`, `return ${column.input} column`);
    return {
      ...(column as Partial<TableColumn>),
      position: column.position ?? index,
      key: column.key ?? columnKey,
      accessor: column.accessor ?? dbTrim(column.label),
      csvCandidate: column.csvCandidate ?? true,
      id: columnKey,
      label: column.label,
      dataType: column.input,
      options: options,
      config: column.config,
    };
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
