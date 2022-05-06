import { RowDataType, NormalizedPath } from 'cdm/FolderModel';
import { Notice, TFile } from 'obsidian';
import { getAPI } from "obsidian-dataview"
import { ActionType } from 'react-table';
import { VaultManagerDB } from 'services/FileManagerService';
import { LOGGER } from "services/Logger";
import NoteInfo from 'services/NoteInfo';
import { DatabaseCore, UpdateRowOptions } from "helpers/Constants";

const noBreakSpace = /\u00A0/g;

/**
 * Check if content has frontmatter
 * @param data 
 * @returns 
 */
function hasFrontmatterKey(data: string): boolean {
  const frontmatterRegex = /---\s+([\w\W]+?)\s+---/
  return frontmatterRegex.test(data);
}

/** Check if file is a database note */
export function isDatabaseNote(data: string): boolean {
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
  const stripped = path.replaceAll("[", "").replaceAll("]", "").replace(noBreakSpace, ' ').normalize('NFC');

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
export async function adapterTFilesToRows(folderPath: string): Promise<Array<RowDataType>> {
  dataviewIsLoaded();
  LOGGER.debug(`=> adapterTFilesToRows.  folderPath:${folderPath}`);
  const rows: Array<RowDataType> = [];
  let id = 0;

  const folderFiles = getAPI(app).pages(`"${folderPath}"`).where(p => !p[DatabaseCore.FRONTMATTER_KEY]);
  await Promise.all(folderFiles.map(async (page) => {
    const noteInfo = new NoteInfo(page, ++id);
    rows.push(noteInfo.getRowDataType());
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
  let content = await VaultManagerDB.obtainContentFromTfile(file);

  // Adds an empty frontmatter at the beginning of the file
  async function addFrontmatter(): Promise<void> {
    /* Regex explanation
    * group 1 all content
    */
    const frontmatterRegex = new RegExp(`(^.*$)`, 'g');
    const noteObject = {
      action: 'replace',
      file: file,
      regexp: frontmatterRegex,
      newValue: `---\n---\n$1`
    };
    // update content on disk and in memory
    content = await VaultManagerDB.editNoteContent(noteObject);
  }
  // Modify value of a column
  async function columnValue(): Promise<void> {
    /* Regex explanation
    * group 1 is frontmatter centinel until current column
    * group 2 is key of current column
    * group 3 is value we want to replace
    * group 4 is the rest of the frontmatter
    */
    const frontmatterRegex = new RegExp(`(^---\\s[\\w\\W]*?)+([\\s]*${columnId}[:]{1})+(.*)+([\\w\\W]*?\\s---)`, 'g');
    // Check if the column is already in the frontmatter
    if (!frontmatterRegex.test(content)) {
      // if the column is not in the frontmatter, add it
      await addColumn();
    } else {
      // If it is, replace the value
      const noteObject = {
        action: 'replace',
        file: file,
        regexp: frontmatterRegex,
        newValue: `$1$2 ${newValue}$4`
      };
      await VaultManagerDB.editNoteContent(noteObject);
    }
  }
  // Modify key of a column
  async function columnKey(): Promise<void> {
    // If it is, replace the value
    /* Regex explanation
    * group 1 is the frontmatter centinel until previous to current column
    * group 2 is the column we want to replace
    * group 3 is the rest of the frontmatter
    */
    const frontmatterRegex = new RegExp(`(^---\\s[\\w\\W]*?)+([\\n]{1}${columnId}[:]{1})+([\\w\\W]*?\\s---)`, 'g');
    // Check if the column is already in the frontmatter
    if (!frontmatterRegex.test(content)) {
      // if the column is not in the frontmatter, add it with the already updated key
      columnId = newValue;
      // then assign an empty value to the new key
      newValue = '';
      await addColumn();
    } else {
      const noteObject = {
        action: 'replace',
        file: file,
        regexp: frontmatterRegex,
        newValue: `$1\n${newValue}:$3`
      };
      await VaultManagerDB.editNoteContent(noteObject);
    }
  }
  // Remove a column
  async function removeColumn(): Promise<void> {
    /* Regex explanation
    * group 1 is the frontmatter centinel until previous to current column
    * group 2 is the column we want to remove
    * group 3 is the rest of the frontmatter
    */
    const frontmatterRegex = new RegExp(`(^---[\\w\\W]*?)+([\\s]*${columnId}[:]{1}.+)+([\\s]*[\\w\\W]*?\\s---)`, 'g');
    const noteObject = {
      action: 'replace',
      file: file,
      regexp: frontmatterRegex,
      newValue: `$1$3`
    };
    await VaultManagerDB.editNoteContent(noteObject);
  }

  // Add a column
  async function addColumn(): Promise<void> {
    /* Regex explanation
    * group 1 the entire frontmatter until flag ---
    * group 2 is the rest of the frontmatter
    */
    const frontmatterRegex = new RegExp(`(^---[\\w\\W]*?)+([\\s]*---)`, 'g');
    const noteObject = {
      action: 'replace',
      file: file,
      regexp: frontmatterRegex,
      newValue: `$1\n${columnId}: ${newValue}$2`
    };
    await VaultManagerDB.editNoteContent(noteObject);
  }

  async function inlineColumnEdit(): Promise<void> {
    const frontmatterRegex = new RegExp(`(^${columnId}[:]{2}\\s)+([\\w\\W]+?$)`, 'gm');
    const noteObject = {
      action: 'replace',
      file: file,
      regexp: frontmatterRegex,
      newValue: `$1${newValue}`
    };
    await VaultManagerDB.editNoteContent(noteObject);
  }
  // Record of options
  const updateOptions: Record<string, any> = {};
  updateOptions[UpdateRowOptions.COLUMN_VALUE] = columnValue;
  updateOptions[UpdateRowOptions.COLUMN_KEY] = columnKey;
  updateOptions[UpdateRowOptions.INLINE_VALUE] = inlineColumnEdit;
  updateOptions[UpdateRowOptions.REMOVE_COLUMN] = removeColumn;
  updateOptions[UpdateRowOptions.ADD_COLUMN] = addColumn;
  // Execute action
  if (updateOptions[option]) {
    // Check if file has frontmatter
    if (!hasFrontmatterKey(content)) {
      // If not, add it
      await addFrontmatter();
    }
    // Then execute the action
    await updateOptions[option]();
  } else {
    throw `Error: option ${option} not supported yet`;
  }
  LOGGER.info(`<=updateRowFile. asociatedFilePathToCell: ${file.path} | columnId: ${columnId} | newValue: ${newValue} | option: ${option}`);
}

/**
 * After update a row value, move the file to the new folder path
 * @param folderPath 
 * @param action 
 */
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
    LOGGER.error(` moveFile Error: ${error.message}`);
    // Handle error
    throw error;
  }
  const filePath = `${folderPath}/${action.file.name}`;
  await app.fileManager.renameFile(action.file, filePath);
}

/**
 * Check if dataview plugin is installed
 * @returns true if installed, false otherwise
 * @throws Error if plugin is not installed
 */
export function dataviewIsLoaded(): boolean {
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