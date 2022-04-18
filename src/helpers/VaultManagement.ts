import { TableRows,TableRow } from 'cdm/FolderModel';
import { getAPI} from "obsidian-dataview"
import { Cell } from 'react-table';
import { VaultManagerDB } from 'services/FileManagerService';
import { LOGGER } from "services/Logger";
import { DatabaseCore, MetadataColumns } from "./Constants";

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
        /** Mandatory fields */
        const aFile: TableRow = {
            id: ++id
        };
        /** Metadata fields */
        aFile[MetadataColumns.FILE]=`${page.file.link.markdown()}`
        /** Optional fields */
        Object.keys(page).forEach(property => {
            const value = page[property];
            if (value && typeof value !== 'object') {
                aFile[property] = value;
            }
        });
        LOGGER.debug(`Push row ${aFile.id}:${JSON.stringify(aFile)}`);
        rows.push(aFile);
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

export function updateRowColumnValue(cellProperties:Cell, newColumnValue:string){
  const cellBasenameFile:string = (cellProperties.row.original as any)[MetadataColumns.FILE].replace(/\[\[|\]\]/g, '').split('|')[0];
  LOGGER.debug(`<=>Cell: updateTargetNoteCell: ${cellBasenameFile} with value: ${newColumnValue}`);
  const columnId = cellProperties.column.id;
  /* Regex explanation
  * group 1 is frontmatter centinel until current column
  * group 2 is key of current column
  * group 3 is value we want to replace
  * group 4 is the rest of the frontmatter
  */
  const frontmatterRegex = new RegExp(`(^---\\s[\\w\\W]*?)+([\\s]*${columnId}[:]{1})+(.+)+([\\w\\W]*?\\s---)`, 'g');
  let noteObject = {
    action: 'replace',
    filePath: `${cellBasenameFile}`,
    regexp: frontmatterRegex,
    newValue: `$1$2 ${newColumnValue}$4`
  };
  VaultManagerDB.editNoteContent(noteObject);
}