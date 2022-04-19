import { DataTypes, MetadataColumns, MetadataLabels } from 'helpers/Constants';
import {TableColumn, TableColumns} from 'cdm/FolderModel';
import { LOGGER } from "services/Logger";
import { DatabaseColumn } from 'cdm/DatabaseModel';
import { RowSelectOption } from 'cdm/RowSelectModel';

/**
 * Add mandatory columns to the table
 * @param columns 
 * @returns 
 */

function metadataColumns(): Record<string, DatabaseColumn> {
  const metadataColumns: Record<string, DatabaseColumn> = {};
  metadataColumns[MetadataColumns.FILE]={
      key: `${MetadataColumns.FILE}`,
      input: DataTypes.MARKDOWN,
      Header: `${MetadataColumns.FILE}`,
      label: MetadataLabels.FILE,
      accessor: `${MetadataColumns.FILE}`,
      isMetadata: true
  };
  metadataColumns[MetadataColumns.ADD_COLUMN]={
    key: `${MetadataColumns.ADD_COLUMN}`,
    Header: `${MetadataColumns.ADD_COLUMN}`,
    input: DataTypes.NEW_COLUMN,
    width: 20,
    disableResizing: true,
    label: '+',
    accessor: `${MetadataColumns.ADD_COLUMN}`,
    isMetadata: true
  }
  return metadataColumns;
}

export async function obtainColumnsFromFolder(databaseColumns: Record<string, DatabaseColumn>): Promise<TableColumns>{
    LOGGER.debug(`=> obtainColumnsFromFolder. databaseColumns: ${JSON.stringify(databaseColumns)}`);
    const columns:TableColumns = [];
    await Promise.all(Object.keys(databaseColumns).map(async (columnKey, index) => {
      const column = databaseColumns[columnKey];
      columns.push(await columnOptions(index+1,column));
    }));
    const meta = metadataColumns();
    await Promise.all(Object.keys(meta).map(async (columnKey) => {
      const column = meta[columnKey];
      columns.push(await columnOptions(parseInt(columnKey),column));
    }));
    LOGGER.debug(`<= obtainColumnsFromFolder(. return ${columns.length} columns`);
    return columns;
}

async function columnOptions(columnId:number, column:DatabaseColumn):Promise<TableColumn> {
  LOGGER.debug(`=> columnOptions. column: ${JSON.stringify(column)}`);
  const options: RowSelectOption[] = [];
  const tableRow: TableColumn = {
    id: columnId,
    label: column.label,
    key: column.key ?? column.label.trim(),
    accessor: column.accessor ?? column.label.trim().toLowerCase(),
    isMetadata: column.isMetadata ?? false
  }
  /**
   * return plain text
   * @returns {TableColumn}
   */
  function isText():TableColumn {
    LOGGER.debug(`<= columnOptions`,`return text column`);
		return {
      ...tableRow,
      dataType: DataTypes.TEXT,
      options: options
    };
  }

  /**
   * return number
   * @returns {TableColumn}
   */
   function isNumber():TableColumn {
    LOGGER.debug(`<= columnOptions`,`return number column`);
		return {
      ...tableRow,
      dataType: DataTypes.NUMBER,
      options: options
    };
  }
  /**
   * return selector
   * @returns {TableColumn}
   */
   function isSelect():TableColumn {
    LOGGER.debug(`<= columnOptions`,`return select column`);
		return {
      ...tableRow,
      dataType: DataTypes.SELECT,
      options: options
    };
  }

  /**
   * return markdown rendered text
   * @returns {TableColumn}
   */
  function isMarkdown():TableColumn {
    LOGGER.debug(`<= columnOptions`,`return markdown column`);
    return {
      ...tableRow,
      dataType: DataTypes.MARKDOWN,
      options: options
    };
  }

  function isNewColumn():TableColumn {
    LOGGER.debug(`<= columnOptions`,`return new column`);
    return {
      ...tableRow,
      dataType: DataTypes.NEW_COLUMN,
      options: options
    };
  }

  // Record of options
  let inputs: Record<string, any> = {};
  inputs[DataTypes.TEXT] = isText;
  inputs[DataTypes.NUMBER] = isNumber;
  inputs[DataTypes.SELECT] = isSelect;
  inputs[DataTypes.MARKDOWN] = isMarkdown;
  inputs[DataTypes.NEW_COLUMN] = isNewColumn;
  if(inputs.hasOwnProperty(column.input)){
    return await inputs[column.input]();
  }else{
    throw `Error: option ${column.input} not supported yet`;
  }
}
