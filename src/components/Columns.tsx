import {
  MarkdownRenderer
} from "obsidian";
import React,{useRef,useLayoutEffect} from 'react';
import { DataTypes } from 'helpers/Constants';
import {TableColumns} from 'cdm/FolderModel';
import { randomColor } from 'helpers/Colors';

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

export function obtainColumnsFromFolder(){
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
    const columns:TableColumns = [];
    columns.push(...mandatoryColumns);
    return columns;
}
