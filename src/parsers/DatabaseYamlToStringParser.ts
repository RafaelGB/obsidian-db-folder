import { DatabaseYaml } from "cdm/DatabaseModel";


/**
 * Given a database config, obtain the string on yaml format
 * @param databaseConfig 
 */
// TODO could be more generic?
const DatabaseYamlToStringParser = (databaseConfig: DatabaseYaml): string[] => {
  const yamlIndent = "  ";
  const databaseConfigString: string[] = [];
  // Database info
  databaseConfigString.push(`name: ${databaseConfig.name}`);
  databaseConfigString.push(`description: ${databaseConfig.description}`);
  // Table Columns
  databaseConfigString.push(`columns:`);
  for (const columnName in databaseConfig.columns) {
    if (databaseConfig.columns[columnName].skipPersist) continue;
    databaseConfigString.push(`${yamlIndent.repeat(1)}${columnName}:`);
    for (const columnKey in databaseConfig.columns[columnName]) {
      databaseConfigString.push(`${yamlIndent.repeat(2)}${columnKey}: ${databaseConfig.columns[columnName][columnKey]}`);
    }
  }
  // Database config
  databaseConfigString.push(`config:`);
  databaseConfigString.push(`${yamlIndent.repeat(1)}enable_show_state: ${databaseConfig.config.enable_show_state}`);
  databaseConfigString.push(`${yamlIndent.repeat(1)}group_folder_column: ${databaseConfig.config.group_folder_column}`);
  databaseConfigString.push(`${yamlIndent.repeat(1)}remove_field_when_delete_column: ${databaseConfig.config.remove_field_when_delete_column}`);

  // Database filters
  if (databaseConfig.filters) {
    databaseConfigString.push(`filters:`);
    for (const filter of databaseConfig.filters) {
      databaseConfigString.push(`${yamlIndent.repeat(1)}- {field: ${filter.field}, operator: ${filter.operator}${filter.value !== undefined ? (",value: " + filter.value)
        : ""}}`);
    }
  }
  return databaseConfigString;
}

export default DatabaseYamlToStringParser;