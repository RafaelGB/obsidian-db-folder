// ts
import faker from "@faker-js/faker";
import React, { useRef, useLayoutEffect } from "react";
import { randomColor } from "helpers/Colors";
import { DataTypes } from "helpers/Constants";
import { TableDataType, TableColumn, RowDataType } from "cdm/FolderModel";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { obtainColumnsFromFolder } from "components/Columns";

/**
 * Generate a random initialState table with the given number of rows.
 * @param count number of rows to generate
 * @returns
 */
export async function makeData(count: number): Promise<TableDataType> {
  const data: Array<RowDataType> = [];
  const options = [];
  const note: any = null;
  for (let i = 0; i < count; i++) {
    const row = {
      id: faker.mersenne.rand(),
      title: faker.system.fileName(),
      note: note,
    };
    options.push({ label: row.title, backgroundColor: randomColor() });

    data.push(row);
  }

  const columns: TableColumn[] = await obtainColumnsFromFolder(
    generateYamlColumns(5)
  );
  return {
    columns: columns,
    shadowColumns: [],
    skipReset: false,
    view: null,
    stateManager: null,
    cellSize: "normal",
  };
}

/**
 * Generate random columns
 * @param count number of columns to generate
 * @returns
 */
export const generateYamlColumns = (
  count: number
): Record<string, DatabaseColumn> => {
  const yamlColumns: Record<string, DatabaseColumn> = {};
  for (let i = 0; i < count; i++) {
    const columnKey: string = faker.unique(faker.name.firstName);
    yamlColumns[columnKey] = {
      input: getRandomEnumValue(DataTypes),
      accessor: columnKey,
      label: `${columnKey} label`,
      key: columnKey,
      position: 1,
      isMetadata: false,
      skipPersist: true,
      csvCandidate: false,
      config: {
        enable_media_view: true,
        media_width: 100,
        media_height: 100,
        isInline: false,
      },
    };
  }
  return yamlColumns;
};

/**
 * Given a Enum, return a random valueß
 * @param anEnum
 * @returns
 */
export function getRandomEnumValue<T>(anEnum: T): T[keyof T] {
  //save enums inside array
  const enumValues = Object.keys(anEnum) as Array<keyof T>;

  //Generate a random index (max is array length)
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  // get the random enum value

  const randomEnumKey = enumValues[randomIndex];
  return anEnum[randomEnumKey];
  // if you want to have the key than return randomEnumKey
}
