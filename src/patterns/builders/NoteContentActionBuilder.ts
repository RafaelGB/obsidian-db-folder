import { NoteContentAction } from "cdm/FolderModel";
import { FileManagerEditOptions, INLINE_POSITION, INLINE_REGEX, WRAPPERER_KEY } from "helpers/Constants";
import { hasFrontmatter } from "helpers/VaultManagement";
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

    /**
     * Add a custom new value for the regex. 
     * 
     * The index of the new value must match the index of the regex.
     * @param regExpNewValue 
     * @returns 
     */
    public addRegExpNewValue(regExpNewValue: string): NoteContentActionBuilder {
        this.regExpNewValue.push(regExpNewValue);
        return this;
    }

    public addInlineFieldRegExpPair(position: string, columnId: string, newValue: string): NoteContentActionBuilder {
        const contentHasFrontmatter = hasFrontmatter(this.content);
        const inlineProperty = `${columnId}:: ${newValue}`;
        let inlineAddRegex: RegExp = undefined;
        let regex_target = ``;
        switch (position) {
            case INLINE_POSITION.BOTTOM:
                regex_target = contentHasFrontmatter ?
                    `$1$2\n${inlineProperty}` :
                    `$1\n${inlineProperty}`;
                break;
            case INLINE_POSITION.LAST_FIELD:
                if (INLINE_REGEX.INLINE_LAST_FIELD.test(this.content)) {
                    inlineAddRegex = INLINE_REGEX.INLINE_LAST_FIELD;
                    regex_target = `$1$2$3$4$5$6$7$8$9$10$2\n$3$4${columnId}$6:: ${newValue}$9\n$12`;
                    break;
                }
            // Else, fall through to default
            default:
                regex_target = contentHasFrontmatter ?
                    `$1\n${inlineProperty}$2` :
                    `${inlineProperty}\n$1`;
        }

        this.addRegExp(inlineAddRegex ?
            inlineAddRegex :
            (
                contentHasFrontmatter ?
                    INLINE_REGEX.INLINE_WITH_FRONTMATTER :
                    INLINE_REGEX.INLINE_WITHOUT_FRONTMATTER
            )
        );

        return this.addRegExpNewValue(regex_target);
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
        const baseInlineContent = `[${WRAPPERER_KEY}]{0,2}${columnId}[${WRAPPERER_KEY}]{0,2}[:]{2}`;
        return baseInlineContent;
    }
}