import { TableRows,TableRow, NoteContentAction } from 'cdm/FolderModel';
import { getAPI} from "obsidian-dataview"
import { VaultManagerDB } from 'services/FileManagerService';
import { LOGGER } from "services/Logger";
import NoteInfo from 'services/NoteInfo';
import { DatabaseCore, MetadataColumns, UpdateRowOptions } from "./Constants";

const noBreakSpace = /\u00A0/g;
interface NormalizedPath {
    root: string;
    subpath: string;
    alias: string;
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
export async function adapterTFilesToRows(folderPath: string): Promise<TableRows> {
    LOGGER.debug(`=> adapterTFilesToRows.  folderPath:${folderPath}`);
    const rows: TableRows = [];
    let id = 0;

    const folderFiles = getAPI(app).pages(`"${folderPath}"`).where(p=>!p[DatabaseCore.FRONTMATTER_KEY]);
    await Promise.all(folderFiles.map(async (page) => {
        const noteInfo = new NoteInfo(page,++id);
        rows.push(noteInfo.getTableRow());
    }));
    LOGGER.debug(`<= adapterTFilesToRows.  number of rows:${rows.length}`);
    return rows;
}

export function adapterRowToDatabaseYaml(rowInfo:any):string{
    let yaml = [];
    yaml.push('---');
    Object.entries(rowInfo).forEach(entry => {
        const [key, value] = entry;
        yaml.push(`${key}: ${value??''}`);
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
export async function updateRowFile(asociatedFilePathToCell:string, columnId:string, newValue:string, option:string):Promise<void> {
  LOGGER.info(`=>updateRowFile. asociatedFilePathToCell: ${asociatedFilePathToCell} | columnId: ${columnId} | newValue: ${newValue} | option: ${option}`);
  const cellBasenameFile:string = asociatedFilePathToCell.replace(/\[\[|\]\]/g, '').split('|')[0];
  // Modify value of a column
  function columnValue():NoteContentAction{
    /* Regex explanation
    * group 1 is frontmatter centinel until current column
    * group 2 is key of current column
    * group 3 is value we want to replace
    * group 4 is the rest of the frontmatter
    */
    const frontmatterRegex = new RegExp(`(^---\\s[\\w\\W]*?)+([\\s]*${columnId}[:]{1})+(.+)+([\\w\\W]*?\\s---)`, 'g');
    return {
      action: 'replace',
      filePath: `${cellBasenameFile}`,
      regexp: frontmatterRegex,
      newValue: `$1$2 ${newValue}$4`
    };
  }
  // Modify key of a column
  function columnKey():NoteContentAction{
    /* Regex explanation
    * group 1 is the frontmatter centinel until previous to current column
    * group 2 is the column we want to replace
    * group 3 is the rest of the frontmatter
    */
    const frontmatterRegex = new RegExp(`(^---\\s[\\w\\W]*?)+([\\s]*${columnId})+([\\w\\W]*?\\s---)`, 'g');
    return {
      action: 'replace',
      filePath: `${cellBasenameFile}`,
      regexp: frontmatterRegex,
      newValue: `$1\n${newValue}$3`
    };
  }
  // Record of options
  const updateOptions: Record<string, any> = {};
  updateOptions[UpdateRowOptions.COLUMN_VALUE] = columnValue;
  updateOptions[UpdateRowOptions.COLUMN_KEY] = columnKey;

  if(updateOptions.hasOwnProperty(option)){
    const noteObject = updateOptions[option]();
    await VaultManagerDB.editNoteContent(noteObject);
  }else{
    throw `Error: option ${option} not supported yet`;
  }
  LOGGER.info(`<=updateRowFile. asociatedFilePathToCell: ${asociatedFilePathToCell} | columnId: ${columnId} | newValue: ${newValue} | option: ${option}`);
}