import { LinkSuggestion } from "cdm/ObsidianModel";
import "obsidian";
declare module "obsidian" {
  interface FileManager {
    createNewMarkdownFile: (folder: TFolder, filename: string) => Promise<TFile>;
  }
  interface MetadataCache {
    getLinkSuggestions: () => LinkSuggestion[];
  }
}