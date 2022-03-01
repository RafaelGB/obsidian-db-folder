import { faker } from '@faker-js/faker';
import { randomColor } from 'cross/Colors';
import { DataTypes } from 'cross/Constants';
import {TableDataType, TableColumns, TableRows} from 'cdm/FolderModel';
export function makeData(count:number):TableDataType {
    let data:TableRows = [];
    let options = [];
    for (let i = 0; i < count; i++) {
      let row = {
        id: faker.mersenne.rand(),
        title: faker.system.fileName(),
      };
      options.push({ label: row.title, backgroundColor: randomColor() });
  
      data.push(row);
    }
    let columns:TableColumns = [
      {
        Header: 'title',
        label: 'File Name',
        accessor: 'title',
        minWidth: 100,
        dataType: DataTypes.TEXT,
        options: options,
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
  