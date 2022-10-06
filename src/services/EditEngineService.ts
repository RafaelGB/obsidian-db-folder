import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { inline_regex_target_in_function_of } from "helpers/FileManagement";
import { TFile } from "obsidian";
import { parseFrontmatterFieldsToString } from "parsers/RowDatabaseFieldsToFile";
import { LOGGER } from "services/Logger";
import { ParseService } from "services/ParseService";
import { InputType, UpdateRowOptions } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { VaultManagerDB } from "services/FileManagerService";
import { inlineRegexInFunctionOf } from "helpers/QueryHelper";
import { EditionError, showDBError } from "errors/ErrorTypes";
import { hasFrontmatter } from "helpers/VaultManagement";
import obtainRowDatabaseFields from "parsers/FileToRowDatabaseFields";
class EditEngine {
    private static instance: EditEngine;

    /**
     * Modify the file asociated to the row in function of input options
     * @param asociatedCFilePathToCell 
     * @param columnId 
     * @param newColumnValue 
     * @param option 
     */
    public async updateRowFileProxy(file: TFile, columnId: string, newValue: Literal, columns: TableColumn[], ddbbConfig: LocalSettings, option: string): Promise<void> {
        await this.updateRowFile(file, columnId, newValue, columns, ddbbConfig, option).catch((err) => {
            showDBError(EditionError.YamlRead, err);
        });
    }

    private async updateRowFile(file: TFile, columnId: string, newValue: Literal, columns: TableColumn[], ddbbConfig: LocalSettings, option: string): Promise<void> {
        LOGGER.info(`=>updateRowFile. file: ${file.path} | columnId: ${columnId} | newValue: ${newValue} | option: ${option}`);
        const content = await VaultManagerDB.obtainContentFromTfile(file);
        const contentHasFrontmatter = hasFrontmatter(content);
        const frontmatterKeys = VaultManagerDB.obtainFrontmatterKeys(content);
        const rowFields = obtainRowDatabaseFields(file, columns, frontmatterKeys);
        const column = columns.find(
            c => c.key === (UpdateRowOptions.COLUMN_KEY === option ? newValue : columnId)
        );
        /*******************************************************************************************
         *                              FRONTMATTER GROUP FUNCTIONS
         *******************************************************************************************/
        // Modify value of a column
        async function columnValue(): Promise<void> {
            if (column.config.isInline) {
                await inlineColumnEdit();
                return;
            }
            rowFields.frontmatter[columnId] = newValue;
            await persistFrontmatter();
            await inlineRemoveColumn();
        }

        // Modify key of a column
        async function columnKey(): Promise<void> {
            if (column.config.isInline) {
                // Go to inline mode
                await inlineColumnKey();
                return;
            }
            // If field does not exist yet, ignore it
            if (!Object.prototype.hasOwnProperty.call(rowFields.frontmatter, columnId)
                && !Object.prototype.hasOwnProperty.call(rowFields.inline, columnId)) {
                return;
            }

            // Check if the column is already in the frontmatter
            // assign an empty value to the new key
            rowFields.frontmatter[ParseService.parseLiteral(newValue, InputType.TEXT, ddbbConfig) as string] = rowFields.frontmatter[columnId] ?? "";
            delete rowFields.frontmatter[columnId];
            await persistFrontmatter(columnId);
        }

        // Remove a column
        async function removeColumn(): Promise<void> {
            if (column.config.isInline) {
                await inlineRemoveColumn();
                return;
            }
            delete rowFields.frontmatter[columnId];
            await persistFrontmatter(columnId);
        }

        async function persistFrontmatter(deletedColumn?: string): Promise<void> {
            const frontmatterGroupRegex = contentHasFrontmatter ? /^---[\s\S]+?---/g : /(^[\s\S]*$)/g;
            const frontmatterFieldsText = parseFrontmatterFieldsToString(rowFields, ddbbConfig, deletedColumn);
            const noteObject = {
                action: 'replace',
                file: file,
                regexp: frontmatterGroupRegex,
                newValue: contentHasFrontmatter ? `${frontmatterFieldsText}` : `${frontmatterFieldsText}\n$1`,
            };
            await VaultManagerDB.editNoteContent(noteObject);
        }

        /*******************************************************************************************
         *                              INLINE GROUP FUNCTIONS
         *******************************************************************************************/
        async function inlineColumnEdit(): Promise<void> {
            const inlineFieldRegex = inlineRegexInFunctionOf(columnId);
            if (!inlineFieldRegex.test(content)) {
                await inlineAddColumn();
                return;
            }
            /* Regex explanation
            * group 1 is inline field checking that starts in new line
            * group 2 is the current value of inline field
            */
            const noteObject = {
                action: 'replace',
                file: file,
                regexp: inlineFieldRegex,
                newValue: `$3$6$7$8 ${ParseService.parseLiteral(newValue, InputType.MARKDOWN, ddbbConfig, true)}$10$11`
            };
            await VaultManagerDB.editNoteContent(noteObject);
            await persistFrontmatter(columnId);
        }

        async function inlineColumnKey(): Promise<void> {
            if (!Object.keys(rowFields.inline).contains(columnId)) {
                return;
            }
            /* Regex explanation
            * group 1 is inline field checking that starts in new line
            * group 2 is the current value of inline field
            */
            const inlineFieldRegex = inlineRegexInFunctionOf(columnId);
            const noteObject = {
                action: 'replace',
                file: file,
                regexp: inlineFieldRegex,
                newValue: `$6$7${newValue}:: $4$9$10$11`
            };
            await VaultManagerDB.editNoteContent(noteObject);
            await persistFrontmatter();
        }

        async function inlineAddColumn(): Promise<void> {
            const inlineAddRegex = contentHasFrontmatter ? new RegExp(`(^---[\\s\\S]+?---)+([\\s\\S]*$)`, 'g') : new RegExp(`(^[\\s\\S]*$)`, 'g');
            const noteObject = {
                action: 'replace',
                file: file,
                regexp: inlineAddRegex,
                newValue: inline_regex_target_in_function_of(
                    ddbbConfig.inline_new_position,
                    columnId,
                    ParseService.parseLiteral(newValue, InputType.MARKDOWN, ddbbConfig).toString(),
                    contentHasFrontmatter
                )
            };
            await VaultManagerDB.editNoteContent(noteObject);
            await persistFrontmatter(columnId);
        }

        async function inlineRemoveColumn(): Promise<void> {
            /* Regex explanation
            * group 1 is inline field checking that starts in new line
            * group 2 is the current value of inline field
            */
            const inlineFieldRegex = inlineRegexInFunctionOf(columnId);
            const noteObject = {
                action: 'replace',
                file: file,
                regexp: inlineFieldRegex,
                newValue: `$6$11`
            };
            await VaultManagerDB.editNoteContent(noteObject);
        }

        // Record of options
        const updateOptions: Record<string, any> = {};
        updateOptions[UpdateRowOptions.COLUMN_VALUE] = columnValue;
        updateOptions[UpdateRowOptions.COLUMN_KEY] = columnKey;
        updateOptions[UpdateRowOptions.REMOVE_COLUMN] = removeColumn;
        updateOptions[UpdateRowOptions.INLINE_VALUE] = inlineColumnEdit;
        // Execute action
        if (updateOptions[option]) {
            // Then execute the action
            await updateOptions[option]();
        } else {
            throw `Error: option ${option} not supported yet`;
        }
        LOGGER.info(`<= updateRowFile.asociatedFilePathToCell: ${file.path} | columnId: ${columnId} | newValue: ${newValue} | option: ${option} `);
    }

    /**
     * Singleton instance
     * @returns {EditEngine}
     */
    public static getInstance(): EditEngine {
        if (!this.instance) {
            this.instance = new EditEngine();
        }
        return this.instance;
    }
}

export const EditEngineService = EditEngine.getInstance();