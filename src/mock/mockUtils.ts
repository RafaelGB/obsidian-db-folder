import { faker } from '@faker-js/faker';
import { randomColor } from 'cross/Colors';
import { DataTypes } from 'cross/Constants';
import {TableDataType, TableColumns, TableRows} from 'cdm/FolderModel';
export function makeData(count:number):TableDataType {
    let data:TableRows = [];
    let options = [];
    for (let i = 0; i < count; i++) {
      let row = {
        ID: faker.mersenne.rand(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        age: Math.floor(20 + Math.random() * 20),
        music: faker.music.genre(),
      };
      options.push({ label: row.music, backgroundColor: randomColor() });
  
      data.push(row);
    }
    let columns:TableColumns = [
      {
        Header: 'firstName',
        label: 'First Name',
        accessor: 'firstName',
        minWidth: 100,
        dataType: DataTypes.TEXT,
        options: ([] as any[]),
      },
      {
        Header: 'lastName',
        label: 'Last Name',
        accessor: 'lastName',
        minWidth: 100,
        dataType: DataTypes.TEXT,
        options: ([] as any[]),
      },
      {
        Header: 'age',
        label: 'Age',
        accessor: 'age',
        width: 80,
        dataType: DataTypes.NUMBER,
        options: ([] as any[]),
      },
      {
        Header: 'email',
        label: 'E-Mail',
        accessor: 'email',
        width: 300,
        dataType: DataTypes.TEXT,
        options: ([] as any[]),
      },
      {
        Header: 'music',
        label: 'Music Preference',
        accessor: 'music',
        dataType: DataTypes.SELECT,
        width: 200,
        options: options,
      }
    ];
    return { columns: columns, data: data, skipReset: false };
  }
  