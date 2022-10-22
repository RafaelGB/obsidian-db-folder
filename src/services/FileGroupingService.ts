import { normalizePath, Notice } from "obsidian";
import { LOGGER } from "services/Logger";
import pLimit from "p-limit";
import { RowDataType } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { resolveNewFilePath } from "helpers/FileManagement";
import { MetadataColumns } from "helpers/Constants";
import { DataviewService } from "./DataviewService";

const limitMovingFiles = pLimit(1);
const limitCreatingFolders = pLimit(1);
const limitBatchDeletionAndOrganization = pLimit(1);

export class FileGroupingService {
  private static async removeEmptyFoldersRecursively(
    directory: string,
    deletedFolders: Set<string>
  ) {
    let list = await app.vault.adapter.list(directory);
    for (const folder of list.folders) {
      deletedFolders = await FileGroupingService.removeEmptyFoldersRecursively(
        folder,
        deletedFolders
      );
    }

    list = await app.vault.adapter.list(directory);
    if (list.files.length === 0 && list.folders.length === 0) {
      await app.vault.adapter.rmdir(directory, false);
      deletedFolders.add(directory);
    }

    return deletedFolders;
  }

  static moveFile = async (folderPath: string, row: RowDataType): Promise<boolean> =>
    limitMovingFiles(async () => {
      const file = row.__note__.getFile();
      const filePath = `${folderPath}/${file.name}`;
      const fileIsAlreadyInCorrectFolder = row.__note__.filepath === filePath;
      if (fileIsAlreadyInCorrectFolder) return false;
      try {
        await FileGroupingService.createFolder(folderPath);
      } catch (error) {
        LOGGER.error(` moveFile Error: ${error.message} `);
        throw error;
      }

      await app.fileManager.renameFile(file, filePath);
      row[MetadataColumns.FILE] = DataviewService.getDataviewAPI().fileLink(filePath);
      row.__note__.filepath = `${folderPath}/${file.name}`;
      return true;
    });

  static createFolder = async (folderPath: string): Promise<void> =>
    await limitCreatingFolders(async () => {
      const isFolderExist = await app.vault.adapter.exists(normalizePath(folderPath));
      if (!isFolderExist) {
        await app.vault.createFolder(`${folderPath}/`);
      }
    });

  static organizeNotesIntoSubfolders = async (
    folderPath: string,
    rows: Array<RowDataType>,
    ddbbConfig: LocalSettings,
  ): Promise<RowDataType[]> =>
    limitBatchDeletionAndOrganization(async () => {
      if (!ddbbConfig.automatically_group_files) return [];
      const movedRows: RowDataType[] = [];
      const pathColumns: string[] = (ddbbConfig.group_folder_column || "")
        .split(",")
        .filter(Boolean);
      for (const row of rows) {
        const newFilePath = resolveNewFilePath({
          pathColumns,
          row,
          ddbbConfig,
          folderPath
        });

        try {
          const fileWasMoved = await FileGroupingService.moveFile(newFilePath, row);
          if (fileWasMoved) {
            movedRows.push(row);
          }
        } catch (error) {
          new Notice(`Error while moving files into subfolders: ${error.message}`, 5000);
          throw error;
        }
      }
      if (movedRows.length > 0) {
        new Notice(
          `Moved ${movedRows.length} file${movedRows.length > 1 ? "s" : ""
          } into subfolders`,
          1500
        );
      }
      return movedRows;
    });

  static removeEmptyFolders = async (directory: string, ddbbConfig: LocalSettings) =>
    limitBatchDeletionAndOrganization(async () => {
      if (!ddbbConfig.automatically_group_files) return;
      if (!ddbbConfig.remove_empty_folders) return;
      try {
        const removedDirectories =
          await FileGroupingService.removeEmptyFoldersRecursively(directory, new Set());
        const n = removedDirectories.size;
        if (n > 0) {
          const message = `Removed ${n} empty director${n === 0 || n > 1 ? "ies" : "y"}`;
          new Notice(message, 1500);
        }
      } catch (error) {
        new Notice(`Error while removing empty folders: ${error.message}`, 5000);
        throw error;
      }
    });
}
