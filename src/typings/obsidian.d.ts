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
     * Returns internal config of Obsidian using the associated key.
     * 
     *  WARNING! not exposed by Obsidian, may break in future.
     * @param param 
     */
    getConfig(param: string): any;
  }

  interface MetadataCache {
    /**
     * Obtain the tags of all the vault with their count.
     * 
     * WARNING! not exposed by Obsidian, may break in future.
     */
    getTags(): Record<string, number>;
  }

  interface WorkspaceLeaf {
    /**
     * Get the id of the leaf.
     * 
     * WARNING! not exposed by Obsidian, may break in future.
     */
    id: string;
  }

  interface Workspace {
    /**
     * Unregister a hover link source from the workspace in order to prevent it from being displayed.
     *
     * WARNING! not exposed by Obsidian, may break in future.
     * @param id 
     * @returns 
     */
    unregisterHoverLinkSource: (id: string) => void;
  }
}