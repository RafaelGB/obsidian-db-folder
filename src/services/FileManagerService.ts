import { RowDatabaseFields } from "cdm/DatabaseModel";
import { NoteContentAction } from "cdm/FolderModel";
import { FileContent } from "helpers/FileContent";
import { parseYaml, TFile, TFolder } from "obsidian";
import { parseFrontmatterFieldsToString, parseInlineFieldsToString } from "parsers/RowDatabaseFieldsToFile";
import { LOGGER } from "services/Logger";
class VaultManager {
  private static instance: VaultManager;

  /**
   * Add new file inside TFolder
   * @param file_path 
   * @param filename 
   * @param content 
   */
  async create_markdown_file(targetFolder: TFolder, filename: string, databasefields: RowDatabaseFields): Promise<TFile> {
    LOGGER.debug(`=> create_markdown_file. name:${targetFolder.path}/${filename})`);
    const created_note = await app.fileManager.createNewMarkdownFile(
      targetFolder,
      filename ?? "Untitled"
    );
    const content = parseFrontmatterFieldsToString(databasefields, {}).concat("\n").concat(parseInlineFieldsToString(databasefields));
    await app.vault.modify(created_note, content ?? "");
    LOGGER.debug(`<= create_markdown_file`);
    return created_note;
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
        case 'remove':
          releasedContent = line_string.remove(note.regexp).value;
          break;
        case 'replace':
          releasedContent = line_string.replaceAll(note.regexp, note.newValue).value;
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

  ontainCurrentFrontmatter(content: string): Record<string, string> {
    const match = content.match(/^---\s+([\w\W]+?)\s+---/);
    if (match) {
      const frontmatterRaw = match[1];
      const yaml = parseYaml(frontmatterRaw);
      const frontmatter: Record<string, string> = {};
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
  /**
   * Obtain TFile from file path
   * @param filePath 
   * @returns 
   */
  obtainTfileFromFilePath(filePath: string): TFile {
    const abstractFile = app.vault.getAbstractFileByPath(filePath);
    if (abstractFile instanceof TFile) {
      return abstractFile;
    } else {
      throw "Error: File " + filePath + " is not a TFile";
    }
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