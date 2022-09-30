import { Notice, TFile } from "obsidian";
import { LOGGER } from "./Logger";
import pLimit from "p-limit";
import { RowDataType } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { resolveNewFilePath } from "helpers/FileManagement";
import { postMoveFile } from "helpers/VaultManagement";

const limitMovingFiles = pLimit(1);
const limitCreatingFolders = pLimit(1);
const limitBatchDeletionAndOrganization = pLimit(1);

export class FileGroupingService {
  private static instance: FileGroupingService;
  private constructor() { }
  public static getInstance(): FileGroupingService {
    if (!this.instance) {
      this.instance = new FileGroupingService();
    }
    return this.instance;
  }

  static moveFile = async (folderPath: string, file: TFile): Promise<void> =>
    limitMovingFiles(() => FileGroupingService._moveFile(folderPath, file));
  private static async _moveFile(
    folderPath: string,
    file: TFile,
  ): Promise<void> {
    try {
      await FileGroupingService.createFolder(folderPath);
    } catch (error) {
      LOGGER.error(` moveFile Error: ${error.message} `);
      throw error;
    }
    const filePath = `${folderPath}/${file.name}`;
    await app.fileManager.renameFile(file, filePath);
  }

  static createFolder = async (folderPath: string): Promise<void> =>
    limitCreatingFolders(() => FileGroupingService._createFolder(folderPath));
  private static async _createFolder(folderPath: string): Promise<void> {
    await app.vault.adapter.exists(folderPath).then(async (exists) => {
      if (!exists) {
        await app.vault.createFolder(`${folderPath}/`);
      }
    });
  }

  static organizeNotesIntoSubfolders = async (
    folderPath: string,
    rows: Array<RowDataType>,
    ddbbConfig: LocalSettings,
  ): Promise<number> =>
    limitBatchDeletionAndOrganization(() =>
      FileGroupingService._organizeNotesIntoSubfolders(
        folderPath,
        rows,
        ddbbConfig,
      ),
    );
  private static async _organizeNotesIntoSubfolders(
    folderPath: string,
    rows: Array<RowDataType>,
    ddbbConfig: LocalSettings,
  ): Promise<number> {
    try {
      if (!ddbbConfig.automatically_group_files) return 0;
      let numberOfMovedFiles = 0;
      const pathColumns: string[] = (ddbbConfig.group_folder_column || '')
        .split(",")
        .filter(Boolean);
      for (const row of rows) {
        let rowTFile = row.__note__.getFile();

        const newFilePath = resolveNewFilePath({
          pathColumns,
          row,
          ddbbConfig,
          folderPath,
        });
        // Check if file is already in the correct folder
        const auxPath = `${newFilePath}/${rowTFile.name}`;
        const fileIsAlreadyInCorrectFolder = row.__note__.filepath === auxPath;
        if (fileIsAlreadyInCorrectFolder) continue;

        await FileGroupingService.moveFile(newFilePath, rowTFile);
        await postMoveFile({ file: rowTFile, row, newFilePath });
        numberOfMovedFiles++;
      }
      if (numberOfMovedFiles > 0)
        new Notice(
          `Moved ${numberOfMovedFiles} file${numberOfMovedFiles > 1 ? "s" : ""
          } into subfolders`,
          1500,
        );

      return numberOfMovedFiles;
    } catch (error) {
      new Notice(
        `Error while moving files into subfolders: ${error.message}`,
        5000,
      );
      throw error;
    }
  }

  private static async removeEmptyFoldersRecursively(
    directory: string,
    deletedFolders: Set<string>,
  ) {
    let list = await app.vault.adapter.list(directory);
    for (const folder of list.folders) {
      deletedFolders = await FileGroupingService.removeEmptyFoldersRecursively(
        folder,
        deletedFolders,
      );
    }

    list = await app.vault.adapter.list(directory);
    if (list.files.length === 0 && list.folders.length === 0) {
      await app.vault.adapter.rmdir(directory, false);
      deletedFolders.add(directory);
    }

    return deletedFolders;
  }

  static removeEmptyFolders = async (
    directory: string,
    ddbbConfig: LocalSettings,
  ) =>
    limitBatchDeletionAndOrganization(() =>
      FileGroupingService._removeEmptyFolders(directory, ddbbConfig),
    );
  private static async _removeEmptyFolders(
    directory: string,
    ddbbConfig: LocalSettings,
  ) {
    if(!ddbbConfig.automatically_group_files) return;
    if (!ddbbConfig.remove_empty_folders) return;
    try {
      const removedDirectories =
        await FileGroupingService.removeEmptyFoldersRecursively(
          directory,
          new Set(),
        );
      const n = removedDirectories.size;
      if (n > 0) {
        const message = `Removed ${n} empty director${n === 0 || n > 1 ? "ies" : "y"
          }`;
        new Notice(message, 1500);
      }
    } catch (error) {
      new Notice(`Error while removing empty folders: ${error.message}`, 5000);
      throw error;
    }
  }
}
