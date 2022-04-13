import { DatabaseYaml } from "cdm/FolderModel";
import { DatabaseCore } from "helpers/Constants";
import { parseYaml } from "obsidian";
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

  export function getDatabaseconfigYaml(data: string):DatabaseYaml {
    LOGGER.debug(`=>getDatabaseconfigYaml`,`data:${data}`);
    if (!data || !hasFrontmatterKey(data))  throw new Error('No frontmatter found');
  
    const match = data.match(/<%%\s+([\w\W]+?)\s+%%>/);
  
    if (!match) {
      return null;
    }
  
    const frontmatterRaw = match[1];
    const databaseConfig = parseYaml(frontmatterRaw);
    LOGGER.debug(`<=getDatabaseconfigYaml`,`return frontmatter: ${JSON.stringify(databaseConfig)}`);
    return databaseConfig
  }