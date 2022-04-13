import {
  MarkdownRenderer
} from "obsidian";
import React,{useRef,useLayoutEffect} from 'react';
import { DataTypes } from 'helpers/Constants';
import {DatabaseColumn, DatabaseColumns, TableColumn, TableColumns} from 'cdm/FolderModel';
import { randomColor } from 'helpers/Colors';
import { LOGGER } from "services/Logger";

/**
 * Add mandatory columns to the table
 * @param columns 
 * @returns 
 */
export function addMandatoryColumns(columns: DatabaseColumns): DatabaseColumns {
  const mandatoryColumns: DatabaseColumns = {
    'title': {
      accessor: 'title',
      input: 'markdown',
      Header: 'title'
    }
  };
  return {...mandatoryColumns, ...columns};
}

export async function obtainColumnsFromFolder(databaseColumns: DatabaseColumns){
    LOGGER.debug(`=> obtainColumnsFromFolder. databaseColumns: ${JSON.stringify(databaseColumns)}`);
    const columns:TableColumns = [];
    // Define mandatory columns
    const titleOptions = [];
    titleOptions.push({ backgroundColor: randomColor() });
    await Promise.all(Object.keys(databaseColumns).map(async (columnKey) => {
      const column = databaseColumns[columnKey];
      columns.push(await columnOptions(columnKey,column));
    }));

    LOGGER.debug(`<= obtainColumnsFromFolder(. return ${columns.length} columns`);
    return columns;
}

async function columnOptions(value:string, column:DatabaseColumn):Promise<TableColumn> {
  LOGGER.debug(`=> columnOptions`,`column: ${JSON.stringify(column)}`);
  const options: any[] = [];
  /**
   * return plain text
   * @returns {TableColumn}
   */
  function isText():TableColumn {
    LOGGER.debug(`<= columnOptions`,`return text column`);
		return {
      Header: value,
      accessor: column.accessor,
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
      Header: value,
      accessor: column.accessor,
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
    options.push({ backgroundColor: randomColor() });
		return {
      Header: value,
      accessor: column.accessor,
      dataType: DataTypes.NUMBER,
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
      Header: value,
      accessor: column.accessor,
      dataType: DataTypes.MARKDOWN,
      options: options
    };
  }

  let inputs: Record<string, any> = {
    'text': isText,
    'markdown': isMarkdown,
    'number': isNumber, // TODO
    'select': isSelect // TODO
  };

  if(inputs.hasOwnProperty(column.input)){
    return await inputs[column.input]();
  }else{
    throw `Error: option ${column.input} not supported yet`;
  }
}
