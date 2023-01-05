import { RowDatabaseFields } from "cdm/DatabaseModel";
import { NoteContentAction } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { FileContent } from "helpers/FileContent";
import { resolve_tfile, resolve_tfolder } from "helpers/FileManagement";
import { Notice, parseYaml, TFile, TFolder } from "obsidian";
import { parseFrontmatterFieldsToString, parseInlineFieldsToString } from "parsers/RowDatabaseFieldsToFile";
import { LOGGER } from "services/Logger";
import { DataviewService } from "services/DataviewService";
import { FileManagerEditOptions, SourceDataTypes } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
class VaultManager {
  private static instance: VaultManager;

  /**
   * Add new file inside TFolder
   * @param file_path 
   * @param filename 
   * @param content 
   */
  async create_markdown_file(targetFolder: TFolder, filename: string, localSettings: LocalSettings, databasefields?: RowDatabaseFields): Promise<TFile> {
    LOGGER.debug(`=> create_markdown_file. name:${targetFolder.path}/${filename})`);
    let content = databasefields ? parseFrontmatterFieldsToString(databasefields, localSettings).concat("\n").concat(parseInlineFieldsToString(databasefields)) : "";

    // Obtain content from current row template
    try {
      if (DataviewService.isTruthy(localSettings.current_row_template) && localSettings.current_row_template.endsWith(".md")) {
        const templateTFile = resolve_tfile(localSettings.current_row_template);
        const templateContent = await this.obtainContentFromTfile(templateTFile);
        content = content.concat(templateContent);
      }
    } catch (err) {
      new Notice(`Error while inserting ${localSettings.current_row_template}: ${err}`);
    }

    // Custom content by source
    switch (localSettings.source_data) {
      case SourceDataTypes.TAG:
        content = content.concat(`#${localSettings.source_form_result}\n`);
        break;
      default:
    }

    const created_note = await app.vault.create(
      targetFolder.path
        .concat("/")
        .concat(filename ?? "Untitled")
        .concat(".md"),
      content ?? ""
    );
    LOGGER.debug(`<= create_markdown_file`);
    return created_note;
  }

  /**
   * Remove file from vault
   * @param note
   */
  async removeNote(note: TFile): Promise<void> {
    app.vault.delete(note);
    new Notice(`File ${note.path} removed from vault`);
  }

  /**
   * Duplicate file from vault
   * @param note 
   * @returns 
   */
  async duplicateNote(note: TFile): Promise<TFile> {
    const duplidatedContent = await this.obtainContentFromTfile(note);
    const duplicatePath = note.path.replace(".md", " (copy).md");

    return await app.vault.create(duplicatePath,
      duplidatedContent ?? "",
      { ctime: note.stat.ctime, mtime: note.stat.mtime }
    );
  }

  /**
  * Edit file content
  * @param note
  */
  async editNoteContent(note: NoteContentAction): Promise<string> {
    LOGGER.debug(`=> editNoteContent. action:${note.action} filePath:${note.file.path}`);
    try {
      let releasedContent = note.content;
      if (releasedContent === undefined) {
        releasedContent = await this.obtainContentFromTfile(note.file);
      }

      const line_string = new FileContent(releasedContent);

      switch (note.action) {
        case FileManagerEditOptions.REMOVE:
          releasedContent = line_string.remove(note).value;
          break;
        case FileManagerEditOptions.REPLACE:
          releasedContent = line_string.replaceAll(note).value;
          break;
        default:
          throw "Error: Option " + note.action + " is not supported";
      }
      await app.vault.modify(note.file, releasedContent);
      LOGGER.debug(`<= editNoteContent. file '${note.file.path}' edited`);
      return releasedContent;
    } catch (err) {
      LOGGER.error(`<= editNoteContent exit with errors`, err);
      throw err;
    }
  }

  /**
   * Obtain content from TFile
   * @param tfile 
   * @returns 
   */
  async obtainContentFromTfile(tfile: TFile): Promise<string> {
    return await app.vault.read(tfile);

  }

  ontainCurrentFrontmatter(content: string): Record<string, Literal> {
    const match = content.match(/^---\s+([\w\W]+?)\s+---/);
    if (match) {
      const frontmatterRaw = match[1];
      const yaml = parseYaml(frontmatterRaw);
      const frontmatter: Record<string, Literal> = {};
      Object.keys(yaml)
        .forEach(key => {
          // add frontmatter fields that are not specified as database fields
          frontmatter[key] = yaml[key];
        });
      return frontmatter;
    }
    else {
      return undefined;
    }
  }

  obtainFrontmatterKeys(content: string): string[] {
    const currentFrontmatter = this.ontainCurrentFrontmatter(content);
    if (currentFrontmatter) {
      return Object.keys(currentFrontmatter);
    }
    else {
      return [];
    }
  }

  /**
 * Generate a new file with the structure of a database view
 * @param folderPath 
 * @param filename 
 * @param ddbbConfig 
 * @returns 
 */
  async create_row_file(
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
    await this.create_markdown_file(
      resolve_tfolder(folderPath),
      trimedFilename,
      ddbbConfig
    );
    return filepath;
  }

  /**
   * Singleton instance
   * @returns {VaultManager}
   */
  public static getInstance(): VaultManager {
    if (!this.instance) {
      this.instance = new VaultManager();
    }
    return this.instance;
  }
}

export const VaultManagerDB = VaultManager.getInstance();