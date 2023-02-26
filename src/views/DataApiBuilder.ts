import { TFile } from "obsidian";
import DefaultDataImpl from "./impl/DefaultDataImpl";

export const dataApiBuilder = (databaseFile: TFile, type?: string) => {
    if (!type || type === "default") {
        return new DefaultDataImpl(databaseFile);
    }
    return null;
}