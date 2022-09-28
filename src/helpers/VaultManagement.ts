import { RowDataType, NormalizedPath, TableColumn } from 'cdm/FolderModel';
import { Notice, TFile } from 'obsidian';
import { LOGGER } from "services/Logger";
import NoteInfo from 'services/NoteInfo';
import { DatabaseCore, MetadataColumns, SourceDataTypes } from "helpers/Constants";
import { generateDataviewTableQuery } from 'helpers/QueryHelper';
import { DataviewService } from 'services/DataviewService';
import { Literal } from 'obsidian-dataview/lib/data-model/value';
import { DataArray } from 'obsidian-dataview/lib/api/data-array';
import { FilterSettings, LocalSettings } from 'cdm/SettingsModel';
import { NoteInfoPage } from 'cdm/DatabaseModel';
import { DatabaseView } from 'DatabaseView';
import { sanitize_path, destination_folder } from './FileManagement';

const noBreakSpace = /\u00A0/g;

/**
 * Check if content has frontmatter
 * @param data 
 * @returns 
 */
export function hasFrontmatter(data: string): boolean {
  if (!data) return false;

  const frontmatterRegex = /^---[\s\S]+?---/g;
  return frontmatterRegex.test(data);
}

/** Check if file is a database note */
export function isDatabaseNote(data: string | TFile) {
  if (data instanceof TFile) {
    if (!data) return false;

    const cache = app.metadataCache.getFileCache(data);

    return !!cache?.frontmatter && !!cache?.frontmatter[DatabaseCore.FRONTMATTER_KEY];
  } else {
    const match = data.match(/---\s+([\w\W]+?)\s+---/);

    if (!match) {
      return false;
    }

    if (!match[1].contains(DatabaseCore.FRONTMATTER_KEY)) {
      return false;
    }

    return true;
  }
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
export async function adapterTFilesToRows(dbFile: TFile, columns: TableColumn[], ddbbConfig: LocalSettings, filters: FilterSettings): Promise<Array<RowDataType>> {
  const folderPath = dbFile.parent.path;
  LOGGER.debug(`=> adapterTFilesToRows.  folderPath:${folderPath}`);
  const rows: Array<RowDataType> = [];

  let folderFiles = await sourceDataviewPages(folderPath, ddbbConfig, columns);
  folderFiles = folderFiles.where(p => (p.file as any).path !== dbFile.path);
  // Config filters asociated with the database
  if (filters.enabled && filters.conditions.length > 0) {
    folderFiles = folderFiles.where(p => DataviewService.filter(filters.conditions, p, ddbbConfig));
  }
  folderFiles.map((page) => {
    const noteInfo = new NoteInfo(page as NoteInfoPage);
    rows.push(noteInfo.getRowDataType(columns, ddbbConfig));
  });

  LOGGER.debug(`<= adapterTFilesToRows.  number of rows:${rows.length}`);
  return rows;
}

export async function obtainAllPossibleRows(folderPath: string, ddbbConfig: LocalSettings, filters: FilterSettings, columns: TableColumn[]): Promise<Array<RowDataType>> {
  LOGGER.debug(`=> obtainAllPossibleRows.  folderPath:${folderPath}`);
  const rows: Array<RowDataType> = [];
  let folderFiles = await sourceDataviewPages(folderPath, ddbbConfig, columns);
  folderFiles = folderFiles.where(p => !p[DatabaseCore.FRONTMATTER_KEY]);
  // Config filters asociated with the database
  if (filters.enabled && filters.conditions.length > 0) {
    folderFiles = folderFiles.where(p => DataviewService.filter(filters.conditions, p, ddbbConfig));
  }
  folderFiles.map((page) => {
    const noteInfo = new NoteInfo(page as NoteInfoPage);
    rows.push(noteInfo.getAllRowDataType(ddbbConfig));
  });

  LOGGER.debug(`<= obtainAllPossibleRows.  number of rows:${rows.length}`);
  return rows;
}

export async function sourceDataviewPages(folderPath: string, ddbbConfig: LocalSettings, columns: TableColumn[]): Promise<DataArray<Record<string, Literal>>> {
  let pagesResult: DataArray<Record<string, Literal>>;
  switch (ddbbConfig.source_data) {
    case SourceDataTypes.TAG:
      pagesResult = DataviewService.getDataviewAPI().pages(`#${ddbbConfig.source_form_result}`);
      break;
    case SourceDataTypes.INCOMING_LINK:
      pagesResult = DataviewService.getDataviewAPI().pages(`[[${ddbbConfig.source_form_result}]]`);
      break;
    case SourceDataTypes.OUTGOING_LINK:
      pagesResult = DataviewService.getDataviewAPI().pages(`outgoing([[${ddbbConfig.source_form_result}]])`);
      break;
    case SourceDataTypes.QUERY:
      pagesResult = await obtainQueryResult(
        generateDataviewTableQuery(
          columns,
          ddbbConfig.source_form_result),
        folderPath
      );
      break;
    default:
      pagesResult = DataviewService.getDataviewAPI().pages(`"${folderPath}"`);
  }
  return pagesResult;
}

async function obtainQueryResult(query: string, folderPath: string): Promise<DataArray<Record<string, Literal>>> {
  try {
    const result = await DataviewService.getDataviewAPI().query(query);
    if (!result.successful || result.value.type !== 'table') {
      throw new Error(`Query ${query} failed`);
    }
    const arrayRecord: Record<string, Literal>[] = [];
    const headers = result.value.headers;
    result.value.values.forEach((row) => {
      const recordResult: Record<string, Literal> = {};
      headers.forEach((header, index) => {
        recordResult[header] = row[index];
      })
      arrayRecord.push(recordResult);
    });
    return DataviewService.getDataviewAPI().array(arrayRecord);
  } catch (error) {
    const msg = `Error obtaining query result: "${query}", current folder loaded instead`;
    LOGGER.error(msg, error);
    new Notice(msg, 10000);
    return DataviewService.getDataviewAPI().pages(`"${folderPath}"`);
  }
}

/**
 * After update a row value, move the file to the new folder path
 * @param folderPath 
 * @param action 
 */
export async function moveFile(folderPath: string, file: TFile): Promise<void> {
  
  try {
    await createFolder(folderPath);
  } catch (error) {
    LOGGER.error(` moveFile Error: ${error.message} `);
    // Handle error
    throw error;
  }
  const filePath = `${folderPath}/${file.name}`;
  await app.fileManager.renameFile(file, filePath);
}

export async function createFolder(folderPath: string): Promise<void> {
  await app.vault.adapter.exists(folderPath).then(async exists => {
    if (!exists) {
      await app.vault.createFolder(`${folderPath}/`);
    }
  });
}


export const postMoveFile = ({ file, row, foldePath, subfolders, }: { row: RowDataType; file: TFile; foldePath: string; subfolders: string; }) => {
  // Update row file
  row[ MetadataColumns.FILE ] = `${file.basename}|${foldePath}/${subfolders}/${file.name}`;
  // Check if action.value is a valid folder name
  const auxPath =
      subfolders !== ""
      ? `${foldePath}/${subfolders}/${file.name}`
      : `${foldePath}/${file.name}`;

  const recordRow: Record<string, Literal> = {};
  Object.entries(row).forEach(([key, value]) => {
      recordRow[key] = value as Literal;
  });

  row.__note__.filepath = auxPath;
};


export const organizeNotesIntoSubfolders = async ( view: DatabaseView,): Promise<number> => {
  if(!view.diskConfig.yaml.config.group_folder_column) return 0;
      let numberOfMovedFiles = 0;
      const pathColumns: string[] =
      view.diskConfig.yaml.config.group_folder_column
          .split(",")
          .filter(Boolean);
      for (const row of view.rows) {

      let rowTFile = row.__note__.getFile();

      const pathHasAnEmptyCell = pathColumns.some((columnName) => !row[columnName]);

      // Update the row on disk
      if (!pathHasAnEmptyCell) {
          const subfolders = pathColumns .map((name) => sanitize_path(row[name] as string, "-")) .join("/");
          const foldePath = destination_folder(view, view.diskConfig.yaml.config);

          // Check if file is already in the correct folder
          const auxPath = `${foldePath}/${subfolders}/${rowTFile.name}`
          const fileIsAlreadyInCorrectFolder =  row.__note__.filepath === auxPath;
          if(fileIsAlreadyInCorrectFolder) continue;

          await moveFile(`${foldePath}/${subfolders}`, rowTFile);
          await postMoveFile({ file: rowTFile, row, foldePath, subfolders });
          numberOfMovedFiles++;
      } 
      
  }
  return numberOfMovedFiles;
};
