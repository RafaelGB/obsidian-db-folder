import { NoteContentAction } from "cdm/FolderModel";
import { FileManagerEditOptions } from "helpers/Constants";
import { TFile } from "obsidian";

export default class NoteContentActionBuilder {
    private file: TFile;
    private content: string;
    private regExpList: RegExp[] = [];
    private regExpNewValue: string[] = [];

    constructor(private action: string = FileManagerEditOptions.REPLACE) {
    }

    public setFile(file: TFile): NoteContentActionBuilder {
        this.file = file;
        return this;
    }

    public setAction(action: string): NoteContentActionBuilder {
        this.action = action;
        return this;
    }

    public setContent(content: string): NoteContentActionBuilder {
        this.content = content;
        return this;
    }

    public addRegExp(regExp: RegExp): NoteContentActionBuilder {
        this.regExpList.push(regExp);
        return this;
    }

    /**
     * Regex for inline content standard. Explanation:
     * 
     * Group 1: From the beginning of the line to the end of the column id
     * 
     * Group 2: The content of the column}
     * @param columnId 
     * @returns 
     */
    public addInlineRegexStandard(columnId: string): NoteContentActionBuilder {
        return this.addRegExp(RegExp(`^(${this.baseInlineRegex(columnId)})(.*$)`, 'gm'));
    }

    /**
     * Regex for inline content with parenthesis. Explanation:
     * 
     * Group 1: From the beginning of the line until before the parenthesis
     * 
     * Group 2: The start parenthesis
     * 
     * Group 3: From the beginning of the column id until the end of the column id
     * 
     * Group 4: The content of the column
     * 
     * Group 5: The end parenthesis
     * 
     * Group 6: From the end of the parenthesis until the end of the line
     * @param columnId 
     * @returns 
     */
    public addInlineRegexParenthesis(columnId: string): NoteContentActionBuilder {
        const parenthesisInlineContent = `^(.*)([\\[(]{1})(${this.baseInlineRegex(columnId)})(.*)([)\\]]{1})(.*$)`
        return this.addRegExp(new RegExp(parenthesisInlineContent, 'gm'));
    }

    /**
     * Regex for inline content with parenthesis. Explanation:
     * 
     * Group 1: From the beginning of the line until before the list or callout
     * 
     * Group 2: The list or callout marker
     * 
     * Group 3: From the beginning of the column id until the end of the column id
     * 
     * Group 4: The content of the column
     * @param columnId 
     * @returns 
     */
    public addInlineRegexListOrCallout(columnId: string): NoteContentActionBuilder {
        const listAndCalloutInlineContent = `^([\\s\\>]*)([\\-\\>]{1}[\\s]{1})(${this.baseInlineRegex(columnId)})(.*$)`
        return this.addRegExp(new RegExp(listAndCalloutInlineContent, 'gm'));
    }

    public addRegExpNewValue(regExpNewValue: string): NoteContentActionBuilder {
        this.regExpNewValue.push(regExpNewValue);
        return this;
    }

    public build(): NoteContentAction {
        this.validate();
        return {
            action: this.action,
            file: this.file,
            content: this.content,
            regexp: this.regExpList,
            newValue: this.regExpNewValue
        };
    }

    public isContentEditable(): boolean {
        return this.regExpList.some((regExp) => {
            return regExp.test(this.content);
        });
    }

    private validate(): void {
        if (this.file === undefined) {
            throw "Error: file is not defined";
        }

        if (this.action === undefined) {
            throw "Error: action is not defined";
        }

        if (this.regExpList.length === 0) {
            throw "Error: regexp is not defined";
        }
    }

    private baseInlineRegex(columnId: string) {
        const wrappererKey = `_\\*~\``;
        const baseInlineContent = `[${wrappererKey}]{0,2}${columnId}[${wrappererKey}]{0,2}[:]{2}`;
        return baseInlineContent;
    }
}