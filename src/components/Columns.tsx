import {
  MarkdownRenderer
} from "obsidian";
import React,{useRef,useLayoutEffect} from 'react';
import { DataTypes } from 'helpers/Constants';
import {DatabaseColumn, DatabaseColumns, TableColumn, TableColumns} from 'cdm/FolderModel';
import { randomColor } from 'helpers/Colors';
import { LOGGER } from "services/Logger";

/**
 * Obtain the path of the file inside cellValue
 * i.e. if cellValue is "[[path/to/file.md|File Name]]" then return "path/to/file.md"
 * i.e. if cellValue is "[[path/to/file.md]]" then return "path/to/file.md"
 * i.e. if cellValue is "[[file.md]]" then return "file.md"
 * @param cellValue 
 */
function getFilePath(cellValue:string):string {
    const regex = /\[\[(.*)\]\]/;
    const matches = regex.exec(cellValue);
    if (matches && matches.length > 1) {
        return matches[1];
    }
    return "";
}

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
      options: []
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
      dataType: DataTypes.TEXT,
      Cell: ({ cell }:any) => {
        const { value } = cell;
        const containerRef = useRef<HTMLElement>();
        useLayoutEffect(() => {
          MarkdownRenderer.renderMarkdown(
            value,
            containerRef.current,
            getFilePath(value),
            null
          );
        })
        return <span ref={containerRef}></span>;
      },
      options: []
    };
  }

  let inputs: Record<string, any> = {
    'text': isText,
    'markdown': isMarkdown
  };

  if(inputs.hasOwnProperty(column.input)){
    return await inputs[column.input]();
  }else{
    throw `Error: option ${column.input} not supported yet`;
  }
}
