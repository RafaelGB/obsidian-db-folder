import { TableRow, NoteContentAction } from 'cdm/FolderModel';
import { Notice, TFile } from 'obsidian';
import { getAPI } from "obsidian-dataview"
import { ActionType } from 'react-table';
import { VaultManagerDB } from 'services/FileManagerService';
import { LOGGER } from "services/Logger";
import NoteInfo from 'services/NoteInfo';
import { DatabaseCore, UpdateRowOptions } from "./Constants";

const noBreakSpace = /\u00A0/g;
interface NormalizedPath {
  root: string;
  subpath: string;
  alias: string;
}

/** Check if file has frontmatter */
export function hasFrontmatterKey(data: string): boolean {
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

export function getNormalizedPath(path: string): NormalizedPath {
  const stripped = path.replace(noBreakSpace, ' ').normalize('NFC');

  // split on first occurance of '|'
  // "root#subpath##subsubpath|alias with |# chars"
  //             0            ^        1
  const splitOnAlias = stripped.split(/\|(.*)/);

  // split on first occurance of '#' (in substring)
  // "root#subpath##subsubpath"
  //   0  ^        1
  const splitOnHash = splitOnAlias[0].split(/#(.*)/);

  return {
    root: splitOnHash[0],
    subpath: splitOnHash[1] ? '#' + splitOnHash[1] : '',
    alias: splitOnAlias[1] || '',
  };
}

/**
 * With the use of Dataview and the folder path, we can obtain an array of rows
 * @param folderPath 
 * @returns 
 */
export async function adapterTFilesToRows(folderPath: string): Promise<Array<TableRow>> {
  dataviewIsLoaded();
  LOGGER.debug(`=> adapterTFilesToRows.  folderPath:${folderPath}`);
  const rows: Array<TableRow> = [];
  let id = 0;

  const folderFiles = getAPI(app).pages(`"${folderPath}"`).where(p => !p[DatabaseCore.FRONTMATTER_KEY]);
  await Promise.all(folderFiles.map(async (page) => {
    const noteInfo = new NoteInfo(page, ++id);
    rows.push(noteInfo.getTableRow());
  }));
  LOGGER.debug(`<= adapterTFilesToRows.  number of rows:${rows.length}`);
  return rows;
}

export function adapterRowToDatabaseYaml(rowInfo: any): string {
  const yaml = [];
  yaml.push('---');
  Object.entries(rowInfo).forEach(entry => {
    const [key, value] = entry;
    yaml.push(`${key}: ${value ?? ''}`);
  });
  yaml.push('---');
  return yaml.join('\n');
}

/**
 * Modify the file asociated to the row in function of input options
 * @param asociatedCFilePathToCell 
 * @param columnId 
 * @param newColumnValue 
 * @param option 
 */
export async function updateRowFile(file: TFile, columnId: string, newValue: string, option: string): Promise<void> {
  LOGGER.info(`=>updateRowFile. file: ${file.path} | columnId: ${columnId} | newValue: ${newValue} | option: ${option}`);
  // Modify value of a column
  function columnValue(): NoteContentAction {
    /* Regex explanation
    * group 1 is frontmatter centinel until current column
    * group 2 is key of current column
    * group 3 is value we want to replace
    * group 4 is the rest of the frontmatter
    */
    const frontmatterRegex = new RegExp(`(^---\\s[\\w\\W]*?)+([\\s]*${columnId}[:]{1})+(.*)+([\\w\\W]*?\\s---)`, 'g');
    return {
      action: 'replace',
      file: file,
      regexp: frontmatterRegex,
      newValue: `$1$2 ${newValue}$4`
    };
  }
  // Modify key of a column
  function columnKey(): NoteContentAction {
    /* Regex explanation
    * group 1 is the frontmatter centinel until previous to current column
    * group 2 is the column we want to replace
    * group 3 is the rest of the frontmatter
    */
    const frontmatterRegex = new RegExp(`(^---\\s[\\w\\W]*?)+([\\n]{1}${columnId}[:]{1})+([\\w\\W]*?\\s---)`, 'g');
    return {
      action: 'replace',
      file: file,
      regexp: frontmatterRegex,
      newValue: `$1\n${newValue}:$3`
    };
  }
  // Remove a column
  function removeColumn(): NoteContentAction {
    /* Regex explanation
    * group 1 is the frontmatter centinel until previous to current column
    * group 2 is the column we want to remove
    * group 3 is the rest of the frontmatter
    */
    const frontmatterRegex = new RegExp(`(^---[\\w\\W]*?)+([\\s]*${columnId}[:]{1}.+)+([\\s]*[\\w\\W]*?\\s---)`, 'g');
    return {
      action: 'replace',
      file: file,
      regexp: frontmatterRegex,
      newValue: `$1$3`
    };
  }

  // Add a column
  function addColumn(): NoteContentAction {
    /* Regex explanation
    * group 1 the entire frontmatter until flag ---
    * group 2 is the rest of the frontmatter
    */
    const frontmatterRegex = new RegExp(`(^---[\\w\\W]*?)+([\\s]*---)`, 'g');
    return {
      action: 'replace',
      file: file,
      regexp: frontmatterRegex,
      newValue: `$1\n${columnId}: ${newValue}$2`
    };
  }
  // Record of options
  const updateOptions: Record<string, any> = {};
  updateOptions[UpdateRowOptions.COLUMN_VALUE] = columnValue;
  updateOptions[UpdateRowOptions.COLUMN_KEY] = columnKey;
  updateOptions[UpdateRowOptions.REMOVE_COLUMN] = removeColumn;
  updateOptions[UpdateRowOptions.ADD_COLUMN] = addColumn;
  // Execute action
  if (updateOptions[option]) {
    const noteObject = updateOptions[option]();
    await VaultManagerDB.editNoteContent(noteObject);
  } else {
    throw `Error: option ${option} not supported yet`;
  }
  LOGGER.info(`<=updateRowFile. asociatedFilePathToCell: ${file.path} | columnId: ${columnId} | newValue: ${newValue} | option: ${option}`);
}

export async function moveFile(folderPath: string, action: ActionType): Promise<void> {
  await updateRowFile(
    action.file,
    action.key,
    action.value,
    UpdateRowOptions.COLUMN_VALUE
  );
  try {
    createFolder(folderPath);
  } catch (error) {
    // Handle error
    throw error;
  } finally {
    const filePath = `${folderPath}/${action.file.name}`;
    await app.fileManager.renameFile(action.file, filePath);
  }
}

/**
 * Check if dataview plugin is installed
 * @returns true if installed, false otherwise
 * @throws Error if plugin is not installed
 */
function dataviewIsLoaded(): boolean {
  if (getAPI()) {
    return true;
  } else {
    new Notice(`Dataview plugin is not installed. Please install it to load Databases.`);
    throw new Error('Dataview plugin is not installed');
  }
}

export async function createFolder(folderPath: string): Promise<void> {
  await app.vault.adapter.exists(folderPath).then(async exists => {
    if (!exists) {
      await app.vault.createFolder(`${folderPath}/`);
    }
  });
}