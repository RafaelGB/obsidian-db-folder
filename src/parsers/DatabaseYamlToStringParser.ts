import { DatabaseYaml } from "cdm/DatabaseModel";

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
  // TODO could be more generic?
const DatabaseYamlToStringParser = (databaseConfig: DatabaseYaml):string[] =>{
    const yamlIndent = "  ";
    const databaseConfigString:string[] = [];
    // Database info
    databaseConfigString.push(`name: ${databaseConfig.name}`);
    databaseConfigString.push(`description: ${databaseConfig.description}`);
    // Table Columns
    databaseConfigString.push(`columns:`);
    for (const columnName in databaseConfig.columns) {
      databaseConfigString.push(`${yamlIndent.repeat(1)}${columnName}:`);
      for (const columnKey in databaseConfig.columns[columnName]) {
        databaseConfigString.push(`${yamlIndent.repeat(2)}${columnKey}: ${databaseConfig.columns[columnName][columnKey]}`);
      }
    }
    // Database config
    databaseConfigString.push(`config:`);
    databaseConfigString.push(`${yamlIndent.repeat(1)}enable_show_state: ${databaseConfig.config.enable_show_state}`);
    return databaseConfigString;
}

export default DatabaseYamlToStringParser;