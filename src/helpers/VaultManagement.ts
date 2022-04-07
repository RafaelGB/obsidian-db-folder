import { App } from "obsidian";
import { TableRows,TableRow } from 'cdm/FolderModel';
import { MetaInfoService } from 'services/MetaInfoService';
import { getAPI} from "obsidian-dataview"
import { LOGGER } from "services/Logger";
import { frontMatterKey } from "parsers/DatabaseParser";

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

export async function adapterTFilesToRows(app: App, folderPath: string): Promise<TableRows> {
    LOGGER.debug(`=> adapterTFilesToRows.  folderPath:${folderPath}`);
    const rows: TableRows = [];
    let id = 0;

    const folderFiles = getAPI(app).pages(`"${folderPath}"`).where(p=>!p[frontMatterKey]);
    await Promise.all(folderFiles.map(async (page) => {
        /** Mandatory fields */
        const aFile: TableRow = {
            id: ++id,
            title: `${page.file.link.markdown()}`
        };
        /** Optional fields */
        Object.keys(page).forEach(property => {
            const value = page[property];
            if (value && typeof value === 'string') {
                aFile[property] = value;
            }
        });
        console.log(`aFile:${JSON.stringify(aFile)}`);
        rows.push(aFile);
    }));
    LOGGER.debug(`<= adapterTFilesToRows.  number of rows:${rows.length}`);
    return rows;
}