import { LocalSettings } from "cdm/SettingsModel";
import { DatabaseView } from "DatabaseView";
import HelperException from "errors/HelperException";
import { normalizePath, TAbstractFile, TFile, TFolder, Vault } from "obsidian";
import { INLINE_POSITION, SourceDataTypes } from "helpers/Constants";
import { RowDataType } from "cdm/FolderModel";
import { VaultManagerDB } from "services/FileManagerService";

export function resolve_tfile(file_str: string, restrict: boolean = true): TFile {
  file_str = normalizePath(file_str);

  const file = app.vault.getAbstractFileByPath(file_str);
  if (!file && restrict) {
    throw new HelperException(`File "${file_str}" doesn't exist`);
  }

  if (!(file instanceof TFile)) {
    if (restrict) {
      throw new HelperException(`${file_str} is a folder, not a file`);
    } else {
      return null;
    }
  }

  return file;
}

export function resolve_tfolder(folder_str: string): TFolder {
  folder_str = normalizePath(folder_str);

  let folder = app.vault.getAbstractFileByPath(folder_str);
  if (!folder) {
    folder = resolve_tfolder(folder_str.split("/").slice(0, -1).join("/"));
  }
  if (!(folder instanceof TFolder)) {
    throw new HelperException(`${folder_str} is a file, not a folder`);
  }
  return folder;
}

export function get_tfiles_from_folder(
  folder_str: string
): Array<TFile> {
  let folder;
  try {
    folder = resolve_tfolder(folder_str);
  } catch (err) {
    // Split the string into '/' and remove the last element
    folder = resolve_tfolder(folder_str.split("/").slice(0, -1).join("/"));
  }
  const files: Array<TFile> = [];
  Vault.recurseChildren(folder, (file: TAbstractFile) => {
    if (file instanceof TFile) {
      files.push(file);
    }
  });

  files.sort((a, b) => {
    return a.basename.localeCompare(b.basename);
  });

  return files;
}

export function destination_folder(view: DatabaseView, ddbbConfig: LocalSettings): string {
  let destination_folder = view.file.parent.path;
  switch (ddbbConfig.source_data) {
    case SourceDataTypes.TAG:
    case SourceDataTypes.OUTGOING_LINK:
    case SourceDataTypes.INCOMING_LINK:
    case SourceDataTypes.QUERY:
      destination_folder = ddbbConfig.source_destination_path;
      break;
    default:
    //Current folder
  }
  return destination_folder;
}

export function inline_regex_target_in_function_of(position: string, columnId: string, newValue: string, contentHasFrontmatter: boolean) {
  let regex_target = "";
  switch (position) {
    case INLINE_POSITION.BOTTOM:
      regex_target = contentHasFrontmatter ? `$1$2\n${columnId}:: ${newValue}` : `$1\n${columnId}:: ${newValue}`;
      break;
    default:
      regex_target = contentHasFrontmatter ? `$1\n${columnId}:: ${newValue}$2` : `${columnId}:: ${newValue}\n$1`;
  }
  return regex_target;
}

/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
export function sanitize_path(path: string, replacement = '') {
  const illegalCharacters = /[\*"\\\/<>:\|\?]/g
  const unsafeCharachersForObsidianLinks = /[#\^\[\]\|]/g
  const dotAtTheStart = /^\./g

  // credit: https://github.com/parshap/node-sanitize-filename/blob/209c39b914c8eb48ee27bcbde64b2c7822fdf3de/index.js#L33
  const controlRe = /[\x00-\x1f\x80-\x9f]/g;
  const reservedRe = /^\.+$/;
  const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
  const windowsTrailingRe = /[\. ]+$/;

  let sanitized = path
    .replace(illegalCharacters, replacement)
    .replace(unsafeCharachersForObsidianLinks, replacement)
    .replace(dotAtTheStart, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement);

  if (replacement)
    sanitized = sanitized
      .replace(new RegExp(`${replacement}+`, 'g'), replacement)
      .replace(new RegExp(`^${replacement}(.)|(.)${replacement}$`, 'g'), '$1$2');
  return sanitized
}

export const resolveNewFilePath = ({
  pathColumns,
  row,
  ddbbConfig,
  folderPath,
}: {
  pathColumns: string[];
  row: RowDataType;
  ddbbConfig: LocalSettings;
  folderPath: string;
}) => {
  const fileHasMissingPathAttributes = pathColumns.some(
    (columnName) => !row[columnName],
  );
  let subfolders;
  if (fileHasMissingPathAttributes) {
    if (ddbbConfig.hoist_files_with_empty_attributes) {
      subfolders = "";
    } else {
      // Hoist to lowest available attribute
      subfolders = pathColumns.reduce(
        (state, name) => {
          if (row[name] && !state.stop) {
            state.subfolders =
              state.subfolders + "/" + sanitize_path(row[name]?.toString(), "-");
          } else {
            state.stop = true;
          }

          return state;
        },
        { subfolders: "", stop: false },
      ).subfolders;
    }
  } else
    subfolders = pathColumns
      .map((name) => sanitize_path(row[name]?.toString(), "-"))
      .join("/");
  return `${folderPath}${subfolders ? `/${subfolders}` : ""}`;
};

/**
 * Generate a new file with the structure of a database view
 * @param folderPath 
 * @param filename 
 * @param ddbbConfig 
 * @returns 
 */
export async function create_row_file(
  folderPath: string,
  filename: string,
  ddbbConfig: LocalSettings
): Promise<string> {
  let trimedFilename = filename.replace(/\.[^/.]+$/, "").trim();
  let filepath = `${folderPath}/${trimedFilename}.md`;
  // Validate possible duplicates
  let sufixOfDuplicate = 0;
  while (resolve_tfile(filepath, false)) {
    sufixOfDuplicate++;
    filepath = `${folderPath}/${trimedFilename}-${sufixOfDuplicate}.md`;
  }

  if (sufixOfDuplicate > 0) {
    trimedFilename = `${trimedFilename}-${sufixOfDuplicate}`;
    filename = `${trimedFilename} copy(${sufixOfDuplicate})`;
  }
  // Add note to persist row
  await VaultManagerDB.create_markdown_file(
    resolve_tfolder(folderPath),
    trimedFilename,
    ddbbConfig
  );
  return filepath;
}