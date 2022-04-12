import faker from '@faker-js/faker';
import {
  MarkdownRenderer
} from "obsidian";
import React,{useRef,useLayoutEffect} from 'react';
import { randomColor } from 'helpers/Colors';
import { DataTypes } from 'helpers/Constants';
import {TableDataType, TableColumns, TableRows} from 'cdm/FolderModel';
export function makeData(count:number):TableDataType {
    const data:TableRows = [];
    const options = [];
    for (let i = 0; i < count; i++) {
      const row = {
        id: faker.mersenne.rand(),
        title: faker.system.fileName(),
      };
      options.push({ label: row.title, backgroundColor: randomColor() });
  
      data.push(row);
    }
    const columns:TableColumns = [
      {
        Header: 'title',
        label: 'File Name',
        accessor: 'title',
        minWidth: 100,
        dataType: DataTypes.TEXT,
        options: options,
        Cell: ({ cell }:any) => {
          const { value } = cell;
          const containerRef = useRef<HTMLElement>();
          console.log("containerRef: "+containerRef);
          useLayoutEffect(() => {
            console.log(containerRef); // { current: <DIV_object> }
            MarkdownRenderer.renderMarkdown(
              '[[readme]]',
              containerRef.current,
              'readme.md',
              null
            );
          })
          
          return <span ref={containerRef}></span>;
        }
      },
      {
        Header: 'Status',
        label: 'Status',
        accessor: 'Status',
        minWidth: 100,
        dataType: DataTypes.TEXT,
        options: options,
      }
    ];
    return { columns: columns, data: data, skipReset: false };
  }
  