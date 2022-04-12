export class FileManager{
    private static instance: FileManager;
    constructor(){}
    
    async create_markdown_file(file_path: string, content: string): Promise<void> {
        await app.fileManager.createNewMarkdownFile(
            file_path,
            "filename" ?? "Untitled"
        );
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