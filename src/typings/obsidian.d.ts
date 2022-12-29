import { LinkSuggestion } from "cdm/ObsidianModel";
import "obsidian";
import { Literal } from "obsidian-dataview";
declare module "obsidian" {
  interface MetadataCache {
    getLinkSuggestions: () => LinkSuggestion[];
  }

  interface FileManager {
    /**
     * Atomically read, modify, and save the frontmatter of a note.
     * The frontmatter is passed in as a JS object, and should be mutated directly to achieve the desired result.
     * 
     * @param file - the file to be modified. Must be a markdown file.
     * @param fn - a callback function which mutates the frontMatter object synchronously.
     * @public
     */
    processFrontMatter(file: TFile, fn: (frontMatter: Record<string, Literal>) => void): Promise<void>
  }

  interface Vault {
    /**
     * TODO: This is a temporary solution. Obsidian not expose official API to get the config.
     * @param param 
     */
    getConfig(param: string): any;
  }
}