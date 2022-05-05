// ts
import faker from "@faker-js/faker";
import { MarkdownRenderer } from "obsidian";
import React, { useRef, useLayoutEffect } from "react";
import { randomColor } from "helpers/Colors";
import { DataTypes } from "helpers/Constants";
import { TableDataType, TableColumn, RowDataType } from "cdm/FolderModel";
import { LOGGER } from "services/Logger";
import { DatabaseColumn } from "cdm/DatabaseModel";

/**
 * Generate a random initialState table with the given number of rows.
 * @param count number of rows to generate
 * @returns
 */
export function makeData(count: number): TableDataType {
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
  const columns: TableColumn[] = [
    {
      id: "title",
      label: "File Name",
      key: "title",
      accessor: "title",
      position: 0,
      minWidth: 100,
      dataType: DataTypes.TEXT,
      options: options,
      csvCandidate: true,
      Cell: ({ cell }: any) => {
        const { value } = cell;
        const containerRef = useRef<HTMLElement>();
        LOGGER.info("containerRef: " + containerRef);
        useLayoutEffect(() => {
          MarkdownRenderer.renderMarkdown(
            "[[readme]]",
            containerRef.current,
            "readme.md",
            null
          );
        });

        return <span ref={containerRef}></span>;
      },
    },
    {
      id: "status",
      label: "Status",
      key: "Status",
      accessor: "Status",
      position: 1,
      minWidth: 100,
      dataType: DataTypes.TEXT,
      options: options,
      csvCandidate: true,
    },
  ];
  return {
    columns: columns,
    shadowColumns: [],
    data: data,
    skipReset: false,
    view: null,
  };
}

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
    };
  }
  return yamlColumns;
};

function getRandomEnumValue<T>(anEnum: T): T[keyof T] {
  //save enums inside array
  const enumValues = Object.keys(anEnum) as Array<keyof T>;

  //Generate a random index (max is array length)
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  // get the random enum value

  const randomEnumKey = enumValues[randomIndex];
  return anEnum[randomEnumKey];
  // if you want to have the key than return randomEnumKey
}
