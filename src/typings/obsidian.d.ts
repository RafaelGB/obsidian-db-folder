import "obsidian";

declare module "obsidian" {
  interface FileManager {
    createNewMarkdownFile: (folder: string, filename: string) => Promise<void>;
  }
}