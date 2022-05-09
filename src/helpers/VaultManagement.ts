import { RowDataType, NormalizedPath, TableDataType } from 'cdm/FolderModel';
import { TFile } from 'obsidian';
import { ActionType } from 'react-table';
import { VaultManagerDB } from 'services/FileManagerService';
import { LOGGER } from "services/Logger";
import NoteInfo from 'services/NoteInfo';
import { DatabaseCore, UpdateRowOptions } from "helpers/Constants";
import obtainRowDatabaseFields from 'parsers/FileToRowDatabaseFields';
import { parseFrontmatterFieldsToString } from 'parsers/RowDatabaseFieldsToFile';
import { DataviewService } from 'services/DataviewService';
import { FilterCondition } from 'cdm/DatabaseModel';

const noBreakSpace = /\u00A0/g;

/**
 * Check if content has frontmatter
 * @param data 
 * @returns 
 */
function hasFrontmatterKey(data: string): boolean {
  const frontmatterRegex = /^---\n+.*---\n/g
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
export async function adapterTFilesToRows(folderPath: string, filters?: FilterCondition[]): Promise<Array<RowDataType>> {
  LOGGER.debug(`=> adapterTFilesToRows.  folderPath:${folderPath}`);
  const rows: Array<RowDataType> = [];
  let id = 0;

  let folderFiles = DataviewService.getDataviewAPI().pages(`"${folderPath}"`)
    .where(p => !p[DatabaseCore.FRONTMATTER_KEY]);
  if (filters) {
    folderFiles = folderFiles.where(p => DataviewService.filter(filters, p));
  }
  await Promise.all(folderFiles.map(async (page) => {
    const noteInfo = new NoteInfo(page, ++id);
    rows.push(noteInfo.getRowDataType());
  }));
  LOGGER.debug(`<= adapterTFilesToRows.  number of rows:${rows.length}`);
  return rows;
}

function filterWithDataviewCondition(condition: string, p: any): boolean {
  if (condition === undefined || condition === "") return true;
  condition.split(" AND ").forEach(c => {
  });
  return true;
}
/**
 * Modify the file asociated to the row in function of input options
 * @param asociatedCFilePathToCell 
 * @param columnId 
 * @param newColumnValue 
 * @param option 
 */
export async function updateRowFile(file: TFile, columnId: string, newValue: string, state: TableDataType, option: string): Promise<void> {
  LOGGER.info(`=>updateRowFile. file: ${file.path} | columnId: ${columnId} | newValue: ${newValue} | option: ${option}`);
  const rowFields = obtainRowDatabaseFields(file, state.columns);
  const content = await VaultManagerDB.obtainContentFromTfile(file);
  const column = state.columns.find(c => c.key === columnId);

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
    await VaultManagerDB.editNoteContent(noteObject);
  }
  /*******************************************************************************************
   *                              FRONTMATTER GROUP FUNCTIONS
   *******************************************************************************************/
  // Modify value of a column
  async function columnValue(): Promise<void> {
    if (column.isInline) {
      await inlineColumnEdit();
      return;
    }
    rowFields.frontmatter[columnId] = newValue;
    await persistFrontmatter();
    await inlineRemoveColumn();
  }

  // Modify key of a column
  async function columnKey(): Promise<void> {
    if (column.isInline) {
      await inlineColumnKey();
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(rowFields.frontmatter, columnId)) {
      return;
    }
    // Check if the column is already in the frontmatter
    // assign an empty value to the new key
    rowFields.frontmatter[newValue] = rowFields.frontmatter[columnId] ?? "";
    delete rowFields.frontmatter[columnId];
    await persistFrontmatter(columnId);
  }

  // Remove a column
  async function removeColumn(): Promise<void> {
    if (column.isInline) {
      await inlineRemoveColumn();
      return;
    }
    delete rowFields.frontmatter[columnId];
    await persistFrontmatter(columnId);
  }

  async function persistFrontmatter(deletedColumn?: string): Promise<void> {
    const frontmatterGroupRegex = new RegExp(`^---\\s+([\\w\\W]+?)\\s+---`, "g");
    const noteObject = {
      action: 'replace',
      file: file,
      regexp: frontmatterGroupRegex,
      newValue: parseFrontmatterFieldsToString(rowFields, content, deletedColumn)
    };
    await VaultManagerDB.editNoteContent(noteObject);
  }
  /*******************************************************************************************
   *                              INLINE GROUP FUNCTIONS
   *******************************************************************************************/
  async function inlineColumnEdit(): Promise<void> {
    /* Regex explanation
    * group 1 is inline field checking that starts in new line
    * group 2 is the current value of inline field
    */
    const inlineFieldRegex = new RegExp(`(^${columnId}[:]{2})+(.*$)`, 'gm');
    if (!inlineFieldRegex.test(content)) {
      await inlineAddColumn();
      return;
    }
    const noteObject = {
      action: 'replace',
      file: file,
      regexp: inlineFieldRegex,
      newValue: `$1 ${newValue}`
    };
    await VaultManagerDB.editNoteContent(noteObject);
    await persistFrontmatter();
  }

  async function inlineColumnKey(): Promise<void> {
    /* Regex explanation
    * group 1 is inline field checking that starts in new line
    * group 2 is the current value of inline field
    */
    const inlineFieldRegex = new RegExp(`(^${columnId}[:]{2})+(.*$)`, 'gm');
    if (!inlineFieldRegex.test(content)) {
      return;
    }
    const noteObject = {
      action: 'replace',
      file: file,
      regexp: inlineFieldRegex,
      newValue: `${newValue}::$2`
    };
    await VaultManagerDB.editNoteContent(noteObject);
    await persistFrontmatter();
  }

  async function inlineAddColumn(): Promise<void> {
    const inlineAddRegex = new RegExp(`(^---\\s+[\\w\\W]+?\\s+---\\s)+(.[\\w\\W]+)`, 'g');
    const noteObject = {
      action: 'replace',
      file: file,
      regexp: inlineAddRegex,
      newValue: `$1${columnId}:: ${newValue}\n$2`
    };
    await VaultManagerDB.editNoteContent(noteObject);
    await persistFrontmatter();
  }

  async function inlineRemoveColumn(): Promise<void> {
    /* Regex explanation
    * group 1 is inline field checking that starts in new line
    * group 2 is the current value of inline field
    */
    const inlineFieldRegex = new RegExp(`(^${columnId}[:]{2}\\s)+([\\w\\W]+?$)`, 'gm');
    const noteObject = {
      action: 'remove',
      file: file,
      regexp: inlineFieldRegex
    };
    await VaultManagerDB.editNoteContent(noteObject);
    await persistFrontmatter(columnId);
  }
  // Record of options
  const updateOptions: Record<string, any> = {};
  updateOptions[UpdateRowOptions.COLUMN_VALUE] = columnValue;
  updateOptions[UpdateRowOptions.COLUMN_KEY] = columnKey;
  updateOptions[UpdateRowOptions.REMOVE_COLUMN] = removeColumn;
  updateOptions[UpdateRowOptions.INLINE_VALUE] = inlineColumnEdit;
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
  LOGGER.info(`<= updateRowFile.asociatedFilePathToCell: ${file.path} | columnId: ${columnId} | newValue: ${newValue} | option: ${option} `);
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
    action.state,
    UpdateRowOptions.COLUMN_VALUE
  );
  try {
    await createFolder(folderPath);
  } catch (error) {
    LOGGER.error(` moveFile Error: ${error.message} `);
    // Handle error
    throw error;
  }
  const filePath = `${folderPath}/${action.file.name}`;
  await app.fileManager.renameFile(action.file, filePath);
}

export async function createFolder(folderPath: string): Promise<void> {
  await app.vault.adapter.exists(folderPath).then(async exists => {
    if (!exists) {
      await app.vault.createFolder(`${folderPath}/`);
    }
  });
}