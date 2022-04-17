import { DatabaseYaml } from "cdm/FolderModel";
import { DatabaseCore } from "helpers/Constants";
import { parseYaml, TFile } from "obsidian";
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