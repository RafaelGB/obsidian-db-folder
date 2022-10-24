import { faker } from "@faker-js/faker";
import { randomColor } from "helpers/Colors";
import { InputType, DEFAULT_COLUMN_CONFIG } from "helpers/Constants";
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
      id: faker.datatype.number(),
      title: faker.system.fileName(),
      __note__: note,
    };
    options.push({ label: row.title, backgroundColor: randomColor() });

    data.push(row);
  }

  const columns: TableColumn[] = await obtainColumnsFromFolder(
    generateYamlColumns(5)
  );
  return {
    skipReset: false,
    view: null,
    stateManager: null,
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
    const columnKey: string = faker.helpers.unique(faker.name.firstName);
    yamlColumns[columnKey] = {
      input: getRandomEnumValue(InputType),
      accessorKey: columnKey,
      label: `${columnKey} label`,
      key: columnKey,
      id: columnKey,
      position: 1,
      isMetadata: false,
      skipPersist: true,
      csvCandidate: false,
      config: DEFAULT_COLUMN_CONFIG,
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
