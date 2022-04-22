import { DatabaseYaml } from "cdm/DatabaseModel";
import { DatabaseCore } from "helpers/Constants";

export function hasFrontmatterKey(data: string) {
  if (!data) return false;

  const match = data.match(/---\s+([\w\W]+?)\s+---/);

  if (!match) {
    return false;
  }

  if (!match[1].contains(DatabaseCore.FRONTMATTER_KEY)) {
    return false;
  }

  return true;
}
  /**
   * Given a database config, obtain the string on yaml format
   * example:
   * "name": "database-name",
   * "description": "database description",
   * columns:
   *   column1:
   *     key1: value1
   *     key2: value2
   *   column2:
   *     key1: value1
   *     key2: value2
   * @param databaseConfig 
   */
  export function convertDatabaseYamlToParsedString(databaseConfig: DatabaseYaml):string[] {
    const yamlIndent = "  ";
    const databaseConfigString:string[] = [];
    databaseConfigString.push(`name: ${databaseConfig.name}`);
    databaseConfigString.push(`description: ${databaseConfig.description}`);
    databaseConfigString.push(`columns:`);
    for (const columnName in databaseConfig.columns) {
      databaseConfigString.push(`${yamlIndent.repeat(1)}${columnName}:`);
      for (const columnKey in databaseConfig.columns[columnName]) {
        databaseConfigString.push(`${yamlIndent.repeat(2)}${columnKey}: ${databaseConfig.columns[columnName][columnKey]}`);
      }
    }
    return databaseConfigString;
  }