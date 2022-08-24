import { TFile } from "obsidian";

export interface LinkSuggestion {
    file: TFile;
    path: string;
    alias: string;
}