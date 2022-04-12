import "obsidian";

declare module "obsidian" {
  interface FileManager {
    createNewMarkdownFile: (folder: TFolder, filename: string) => Promise<TFile>;
  }
}