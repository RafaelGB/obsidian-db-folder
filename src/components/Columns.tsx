import { DataTypes, MetadataColumns } from 'helpers/Constants';
import {DatabaseColumn, DatabaseColumns, RowSelectOption, TableColumn, TableColumns} from 'cdm/FolderModel';
import { LOGGER } from "services/Logger";

/**
 * Add mandatory columns to the table
 * @param columns 
 * @returns 
 */
export function addMandatoryColumns(columns: DatabaseColumns): DatabaseColumns {
  const metadataColumns: DatabaseColumns = {};
  metadataColumns[MetadataColumns.FILE]={
      accessor: MetadataColumns.FILE,
      input: DataTypes.MARKDOWN,
      Header: MetadataColumns.FILE,
      label: MetadataColumns.FILE,
      isMetadata: true
  };
  return {...columns, ...metadataColumns};
}

export async function obtainColumnsFromFolder(databaseColumns: DatabaseColumns): Promise<TableColumns>{
    LOGGER.debug(`=> obtainColumnsFromFolder. databaseColumns: ${JSON.stringify(databaseColumns)}`);
    databaseColumns = addMandatoryColumns(databaseColumns);
    const columns:TableColumns = [];
    await Promise.all(Object.keys(databaseColumns).map(async (columnKey) => {
      const column = databaseColumns[columnKey];
      columns.push(await columnOptions(columnKey,column));
    }));

    LOGGER.debug(`<= obtainColumnsFromFolder(. return ${columns.length} columns`);
    return columns;
}

async function columnOptions(value:string, column:DatabaseColumn):Promise<TableColumn> {
  LOGGER.debug(`=> columnOptions. column: ${JSON.stringify(column)}`);
  const options: RowSelectOption[] = [];
  const tableRow: TableColumn = {
    id: value,
    label: column.label ?? value,
    accessor: column.accessor ?? value,
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

  // Record of options
  let inputs: Record<string, any> = {};
  inputs[DataTypes.TEXT] = isText;
  inputs[DataTypes.NUMBER] = isNumber;
  inputs[DataTypes.SELECT] = isSelect;
  inputs[DataTypes.MARKDOWN] = isMarkdown;

  if(inputs.hasOwnProperty(column.input)){
    return await inputs[column.input]();
  }else{
    throw `Error: option ${column.input} not supported yet`;
  }
}
