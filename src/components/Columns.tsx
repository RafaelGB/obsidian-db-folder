import {
  MarkdownRenderer, parseYaml, TFile
} from "obsidian";
import React,{useRef,useLayoutEffect} from 'react';
import { DataTypes } from 'services/Constants';
import {DatabaseColumn, TableColumn, TableColumns} from 'cdm/FolderModel';
import { randomColor } from 'helpers/Colors';
import { obtainContentFromTfile } from "helpers/VaultManagement";
import { LOGGER } from "services/Logger";
import { getDatabaseconfigYaml } from "parsers/DatabaseParser";

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

export async function obtainColumnsFromFolder(databaseFile: TFile){
    LOGGER.debug(`=> obtainColumnsFromFolder(${databaseFile.path})`);
    const databaseRaw = await obtainContentFromTfile(databaseFile);
    const databaseConfigYaml = getDatabaseconfigYaml(databaseRaw);
    const columns:TableColumns = [];
    // Define mandatory columns
    const titleOptions = [];
    titleOptions.push({ backgroundColor: randomColor() });
    const mandatoryColumns:TableColumns = [
        {
          Header: 'title',
          label: 'File Name',
          accessor: 'title',
          minWidth: 100,
          dataType: DataTypes.TEXT,
          options: titleOptions,
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
          }
        }
    ];
    
    columns.push(...mandatoryColumns);
    await Promise.all(Object.keys(databaseConfigYaml.columns).map(async (columnKey) => {
      const column = databaseConfigYaml.columns[columnKey];
      columns.push(await columnOptions(columnKey,column));
    }));

    LOGGER.debug(`<= obtainColumnsFromFolder(${databaseFile.path})`);
    return columns;
}

async function columnOptions(key:string, column:DatabaseColumn):Promise<TableColumn> {
  LOGGER.debug(`=> columnOptions`,`column: ${JSON.stringify(column)}`);
  function isText():TableColumn {
    LOGGER.debug(`<= columnOptions`,`return text column`);
		return {
      Header: key,
      accessor: column.accessor,
    };
  }

  let inputs: Record<string, any> = {
    'text': isText
  };

  if(inputs.hasOwnProperty(column.input)){
    return await inputs[column.input]();
  }else{
    throw `Error: option ${column.input} not supported yet`;
  }
}
