import { TFile } from "obsidian";

const linkRegex = /\B\[\[([^\]]*)$/;
const embedRegex = /\B!\[\[([^\]]*)$/;

const linkHeadingRegex = /\B\[\[([^#\]]+)#([^\]]*)$/;
const embedHeadingRegex = /\B!\[\[([^#\]]+)#([^\]]*)$/;

const linkBlockRegex = /\B\[\[([^#\]]+)#?\^([^\]]*)$/;
const embedBlockRegex = /\B!\[\[([^#\]]+)#?\^([^\]]*)$/;

function getSuggestedFiles(text: string): void {
    const files: TFile[] = [];
    let matches = text.match(linkRegex);
    if (matches) {
        const fileName = matches[1];
        console.log("String is a link!");
    }
    matches = text.match(embedRegex);
    if (matches) {
        const fileName = matches[1];
        console.log("String is a  Embed link!");
    }
    matches = text.match(linkHeadingRegex);
    if (matches) {
        const fileName = matches[1];
        console.log("String is a link with a heading!");
    }
    matches = text.match(embedHeadingRegex);
    if (matches) {
        const fileName = matches[1];
        console.log("String is a  Embed link with a heading!");
    }
    matches = text.match(linkBlockRegex);
    if (matches) {
        const fileName = matches[1];
        console.log("String is a link with a block!");
    }
    matches = text.match(embedBlockRegex);
    if (matches) {
        const fileName = matches[1];
        console.log("String is a  Embed link with a block!");
    }
}