import { FileContent } from "helpers/FileContent";
import { TFile, TFolder } from "obsidian";
import { LOGGER } from "services/Logger";
export class VaultManager{
    private static instance: VaultManager;
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
            let tfile = this.obtainTfileFromFilePath(note.filePath);
            let tfileContent = await this.obtainContentFromTfile(tfile);
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
     * Obtain content from TFile
     * @param tfile 
     * @returns 
     */
    async obtainContentFromTfile(tfile: TFile): Promise<string> {
      let content = await app.vault.read(tfile);
      return content;
    }

    /**
     * Obtain TFile from file path
     * @param filePath 
     * @returns 
     */
    obtainTfileFromFilePath(filePath:string):TFile{
      let tfile = app.vault.getMarkdownFiles().find(tfile => tfile.path===filePath);
      return tfile;
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