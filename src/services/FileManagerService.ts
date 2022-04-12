import { App } from "obsidian";

export class FileManager{
    private static instance: FileManager;
    private app: App;
    constructor(app: App){
        this.app = app;
    }
    
    async create_markdown_file(file_path: string, content: string): Promise<void> {
        await this.app.fileManager.createNewMarkdownFile(
            file_path,
            "filename" ?? "Untitled"
        );
    }
    /**
     * Singleton instance
     * @returns {Schema}
     */
    public static getInstance(app?: App): FileManager {
    if (!this.instance) {
        this.instance = new FileManager(app);
    }
        return this.instance;
    }
}