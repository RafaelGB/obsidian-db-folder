import { DatabaseYaml, TableDataType } from "cdm/FolderModel";
import { DatabaseCore } from "helpers/Constants";
import { parseYaml, TFile } from "obsidian";
import { ActionType } from "react-table";
import { VaultManagerDB } from "services/FileManagerService";
import { LOGGER } from "services/Logger";

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

  export async function getDatabaseconfigYaml(file: TFile):Promise<DatabaseYaml> {
    LOGGER.debug(`=>getDatabaseconfigYaml`,`file:${file.path}`);
    const databaseRaw = await VaultManagerDB.obtainContentFromTfile(file);
    if (!databaseRaw || !hasFrontmatterKey(databaseRaw))  throw new Error('No frontmatter found');
  
    const match = databaseRaw.match(/<%%\s+([\w\W]+?)\s+%%>/);
  
    if (!match) {
      return null;
    }
  
    const frontmatterRaw = match[1];
    const databaseConfig = parseYaml(frontmatterRaw);
    LOGGER.debug(`<=getDatabaseconfigYaml`,`return frontmatter: ${JSON.stringify(databaseConfig)}`);
    return databaseConfig
  }

  export async function setDatabaseconfigYaml(file: TFile, databaseConfig: DatabaseYaml):Promise<void> {
    LOGGER.debug(`=>setDatabaseconfigYaml`,`file:${file.path}`);
    const configRegex = new RegExp(`<%%\\s+([\\w\\W]+?)\\s+%%>`,"g");
    const databaseFilePath = file.path;
    const databaseConfigUpdated = convertDatabaseYamlToParsedString(databaseConfig).join("\n");
    let noteObject = {
      action: 'replace',
      filePath: `${databaseFilePath}`,
      regexp: configRegex,
      newValue: `<%%\n${databaseConfigUpdated}\n%%>`
    };
    // Update configuration file
    VaultManagerDB.editNoteContent(noteObject);
    LOGGER.debug(`<=setDatabaseconfigYaml`,`set file ${databaseFilePath} with ${databaseConfigUpdated}`);
  }

  export async function updateColumnHeaderOnDatabase(state:TableDataType, oldColumnId:string, newColumnId:string):Promise<void>{
    // clone current column configuration
    const currentCol = state.configuration.columns[oldColumnId];
    // update column id
    currentCol.label = newColumnId;
    currentCol.accessor = newColumnId;
    delete state.configuration.columns[oldColumnId];
    state.configuration.columns[newColumnId] = currentCol;
    // save on disk
    setDatabaseconfigYaml(state.view.file, state.configuration);
    state.data.forEach((row) => {
    });
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
  function convertDatabaseYamlToParsedString(databaseConfig: DatabaseYaml):string[] {
    const yamlIndent = "  ";
    const databaseConfigString:string[] = [];
    databaseConfigString.push(`name: ${databaseConfig.name}`);
    databaseConfigString.push(`description: ${databaseConfig.description}`);
    databaseConfigString.push(`columns:`);
    for (let columnName in databaseConfig.columns) {
      databaseConfigString.push(`${yamlIndent.repeat(1)}${columnName}:`);
      for (let columnKey in databaseConfig.columns[columnName]) {
        databaseConfigString.push(`${yamlIndent.repeat(2)}${columnKey}: ${databaseConfig.columns[columnName][columnKey]}`);
      }
    }
    return databaseConfigString;
  }