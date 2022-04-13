import { FileContent } from "helpers/FileContent";
import { obtainContentFromTfile, obtainTfileFromFilePath } from "helpers/VaultManagement";
import { TFile, TFolder } from "obsidian";
import { LOGGER } from "services/Logger";
export class FileManager{
    private static instance: FileManager;
    constructor(){}
    
    /**
     * Add new file inside TFolder
     * @param file_path 
     * @param filename 
     * @param content 
     */
    async create_markdown_file(targetFolder: TFolder, filename:string, content?: string): Promise<TFile> {
        LOGGER.debug(`=> create_markdown_file. name:${targetFolder.path}/${filename})`);
        const created_note = await app.fileManager.createNewMarkdownFile(
            targetFolder,
            filename ?? "Untitled"
        );
        await app.vault.modify(created_note, content ?? "");
        LOGGER.debug(`<= create_markdown_file`);
        return created_note;
    }
     /**
      * Edit file content
      * @param note 
      */
    async editNoteContent(note:any) {
        LOGGER.debug(`=> editNoteContent. note:${JSON.stringify(note)}`);
        try{
            let tfile = obtainTfileFromFilePath(note.filePath);
            let tfileContent = await obtainContentFromTfile(tfile);
            let line_string = new FileContent(tfileContent);
            let releasedContent = tfileContent;
            switch (note.action) {
              case 'remove':
                releasedContent = line_string.remove(note.regexp).value;
                break;
              case 'replace':
                releasedContent = line_string.replaceAll(note.regexp, note.newValue).value;
                break;
              default:
                throw "Error: Option " + note.action + " is not supported with tp.user.editNoteContent.";
            }
            app.vault.modify(tfile,releasedContent);
            LOGGER.debug(`<= editNoteContent. file '${tfile.path}' edited`);
        }catch(err) {
            LOGGER.error(`<= editNoteContent exit with errors`,err);
        }
      }
    /**
     * Singleton instance
     * @returns {FileManager}
     */
    public static getInstance(): FileManager {
    if (!this.instance) {
        this.instance = new FileManager();
    }
        return this.instance;
    }
}
 
export const FileManagerDB = FileManager.getInstance();