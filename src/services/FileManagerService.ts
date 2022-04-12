import { TFile, TFolder } from "obsidian";
import { LOGGER } from "./Logger";

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