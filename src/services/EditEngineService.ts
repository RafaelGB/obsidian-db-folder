import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { requireApiVersion, TFile } from "obsidian";
import { LOGGER } from "services/Logger";
import { ParseService } from "services/ParseService";
import { InputType, UpdateRowOptions } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { VaultManagerDB } from "services/FileManagerService";
import { EditionError, showDBError } from "errors/ErrorTypes";
import obtainRowDatabaseFields from "IO/md/FileToRowDatabaseFields";
import { EditArguments } from "cdm/ServicesModel";
import NoteContentActionBuilder from "patterns/builders/NoteContentActionBuilder";
import { parseFrontmatterFieldsToString } from "IO/md/RowDatabaseFieldsToFile";
import { hasFrontmatter } from "helpers/VaultManagement";
import { ValueOf } from "typings/base";
import { RowDatabaseFields } from "cdm/DatabaseModel";
type EditContext = {
    file: TFile,
    columnId: string,
    column: TableColumn,
    newValue: Literal,
    content: string,
    ddbbConfig: LocalSettings,
    contentHasFrontmatter: boolean,
    rowFields: RowDatabaseFields,
    deletedColumn?: string,
    newKey?: string
}

class EditEngine {
    private static instance: EditEngine;

    private onFlyEditions: EditArguments[] = [];
    private currentTimeout: NodeJS.Timeout = null;
    /**
     * Modify all the files asociated to the rows using lambaUpdate per every row filtered by the lambdaFilter
     * @param lambdaUpdate 
     * @param lambdaFilter 
     * @param allRows 
     * @param affectedColumn 
     * @param columns 
     * @param ddbbConfig 
     */
    public async batchUpdateRowFiles(
        lambdaUpdate: (cellValue: Literal) => Literal,
        lambdaFilter: (cellValue: Literal) => boolean,
        allRows: RowDataType[],
        affectedColumn: TableColumn,
        columns: TableColumn[],
        ddbbConfig: LocalSettings
    ): Promise<void> {
        const rowCandidates = allRows.filter((row) => {
            const cellContent = ParseService.parseRowToCell(
                row,
                affectedColumn,
                affectedColumn.input,
                ddbbConfig
            );
            return lambdaFilter(cellContent);
        });

        rowCandidates.map((row) => {
            const rowTFile = row.__note__.getFile();
            const cellContent = ParseService.parseRowToCell(
                row,
                affectedColumn,
                affectedColumn.input,
                ddbbConfig
            );
            const editedCell = lambdaUpdate(cellContent);
            const editedRow = ParseService.parseRowToLiteral(
                row,
                affectedColumn,
                editedCell
            );

            EditEngineService.updateRowFileProxy(
                rowTFile,
                affectedColumn.key,
                editedRow,
                columns,
                ddbbConfig,
                UpdateRowOptions.COLUMN_VALUE
            );
        });
    }

    /**
     * Modify the file asociated to the row in function of input options
     * @param asociatedCFilePathToCell 
     * @param columnId 
     * @param newColumnValue 
     * @param option 
     */
    public async updateRowFileProxy(p_file: TFile, p_columnId: string, p_newValue: Literal, p_columns: TableColumn[], p_ddbbConfig: LocalSettings, p_option: ValueOf<typeof UpdateRowOptions>): Promise<void> {
        await this.onFlyEditions.push({
            file: p_file,
            columnId: p_columnId,
            newValue: p_newValue,
            columns: p_columns,
            ddbbConfig: p_ddbbConfig,
            option: p_option
        });
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
        }
        this.currentTimeout = setTimeout(async () => {
            // Call all onFlyEditions
            while (this.onFlyEditions.length > 0) {

                const { file, columnId, newValue, columns, ddbbConfig, option } = this.onFlyEditions.shift();
                await this.updateRowFile(file, columnId, newValue, columns, ddbbConfig, option)
                    .catch((err) => {
                        showDBError(EditionError.YamlRead, err);
                    });
                // Delay to avoid overloading the system
                await sleep(25);
            }
            this.currentTimeout = null;
        }, 250);
    }

    private async updateRowFile(file: TFile, columnId: string, newValue: Literal, columns: TableColumn[], ddbbConfig: LocalSettings, option: string): Promise<void> {
        LOGGER.info(`=>updateRowFile. file: ${file.path} | columnId: ${columnId} | newValue: ${newValue} | option: ${option}`);
        const content = await VaultManagerDB.obtainContentFromTfile(file);
        const frontmatterKeys = VaultManagerDB.obtainFrontmatterKeys(content);
        const rowFields = obtainRowDatabaseFields(file, columns, frontmatterKeys);
        const contentHasFrontmatter = hasFrontmatter(content);
        const column = columns.find(
            c => c.key === (UpdateRowOptions.COLUMN_KEY === option ? newValue : columnId)
        );

        const context: EditContext = {
            file,
            column,
            columnId,
            newValue,
            content,
            ddbbConfig,
            contentHasFrontmatter,
            rowFields
        };

        switch (option) {
            case UpdateRowOptions.COLUMN_VALUE:
                this.columnValue(context);
                break;
            case UpdateRowOptions.COLUMN_KEY:
                this.columnKey(context);
                break;
            case UpdateRowOptions.REMOVE_COLUMN:
                this.removeColumn(context);
                break;
            default:
                throw `Error: option ${option} not supported yet`;
        }
        LOGGER.info(`<= updateRowFile.asociatedFilePathToCell: ${file.path} | columnId: ${columnId} | newValue: ${newValue} | option: ${option} `);
    }
    /*******************************************************************************************
     *                              FRONTMATTER GROUP FUNCTIONS
     *******************************************************************************************/

    /**
     * Delete a column from the frontmatter
     * @param context 
     * @returns 
     */
    private async removeColumn(context: EditContext): Promise<void> {
        const { column, file, columnId, rowFields } = context;
        if (column.config.isInline) {
            await this.inlineRemoveColumn(file, columnId);
            return;
        }
        delete rowFields.frontmatter[columnId];
        await this.persistFrontmatter({ ...context, deletedColumn: columnId });
    }

    /**
     * Modify the value of a column in the frontmatter
     */
    private async columnKey(context: EditContext): Promise<void> {
        const { column, columnId, newValue, rowFields, ddbbConfig } = context;
        if (column.config.isInline) {
            // Go to inline mode
            await this.inlineColumnKey(context);
            return;
        }
        // If field does not exist yet, ignore it
        if (!Object.prototype.hasOwnProperty.call(rowFields.frontmatter, columnId)
            && !Object.prototype.hasOwnProperty.call(rowFields.inline, columnId)) {
            return;
        }

        // Check if the column is already in the frontmatter
        // assign an empty value to the new key
        const newKey = ParseService.parseLiteral(newValue, InputType.TEXT, ddbbConfig) as string;
        rowFields.frontmatter[newKey] = rowFields.frontmatter[columnId] ?? "";
        delete rowFields.frontmatter[columnId];
        await this.persistFrontmatter({ ...context, deletedColumn: columnId, newKey: newKey });
    }

    /**
     * Modify the value of a column in the frontmatter
     * @param context 
     * @returns 
     */
    private async columnValue(context: EditContext): Promise<void> {
        const { file, columnId, newValue, column, rowFields } = context;
        if (column.config.isInline) {
            await this.inlineColumnEdit(context);
            return;
        }
        rowFields.frontmatter[columnId] = newValue;
        await this.persistFrontmatter(context);
        await this.inlineRemoveColumn(file, columnId);
    }

    /**
     * Persist the frontmatter of a file
     * @param context 
     */
    private async persistFrontmatter(
        context: EditContext,
    ): Promise<void> {
        const {
            file,
            columnId,
            content,
            ddbbConfig,
            contentHasFrontmatter,
            rowFields,
            deletedColumn,
            newKey
        } = context;

        if (requireApiVersion("1.1.1")) {
            await app.fileManager.processFrontMatter(file, (frontmatter) => {
                if (newKey) {
                    frontmatter[newKey] = frontmatter[deletedColumn];
                } else {
                    frontmatter[columnId] = ParseService.parseLiteral(
                        rowFields.frontmatter[columnId],
                        InputType.MARKDOWN,
                        ddbbConfig
                    );
                }

                if (deletedColumn) {
                    delete frontmatter[deletedColumn];
                }
            });
        } else {
            const frontmatterGroupRegex = contentHasFrontmatter ? /^---[\s\S]+?---\n*/g : /(^[\s\S]*$)/g;
            const frontmatterFieldsText = parseFrontmatterFieldsToString(rowFields, ddbbConfig, deletedColumn);
            const newContent = contentHasFrontmatter ? `${frontmatterFieldsText}\n` : `${frontmatterFieldsText ? frontmatterFieldsText.concat('\n') : frontmatterFieldsText}$1`;
            const builder = new NoteContentActionBuilder()
                .setContent(content)
                .setFile(file)
                .addRegExp(frontmatterGroupRegex)
                .addRegExpNewValue(newContent)
                .build();
            await VaultManagerDB.editNoteContent(builder);
        }
    }

    /*******************************************************************************************
     *                              INLINE GROUP FUNCTIONS
     *******************************************************************************************/

    /**
     * Remove a column from a file using inline notation
     * @param file 
     * @param columnId 
     */
    private async inlineRemoveColumn(file: TFile, columnId: string): Promise<void> {
        const noteObject = new NoteContentActionBuilder()
            .setFile(file)
            .addInlineRegexStandard(columnId)
            .addRegExpNewValue(``)
            .addInlineRegexParenthesis(columnId)
            .addRegExpNewValue(`$1$2$5$6`)
            .addInlineRegexListOrCallout(columnId)
            .addRegExpNewValue(``)
            .build();

        await VaultManagerDB.editNoteContent(noteObject);
    }

    /**
     * Add a column to a file using inline notation
     * @param context 
     */
    private async inlineAddColumn(context: EditContext): Promise<void> {
        const {
            file,
            columnId,
            content,
            newValue,
            ddbbConfig,
        } = context;

        const mdProperty = ParseService.parseLiteral(
            newValue,
            InputType.MARKDOWN,
            ddbbConfig,
            true
        ).toString();

        const noteObject = new NoteContentActionBuilder()
            .setContent(content)
            .setFile(file)
            .addInlineFieldRegExpPair(ddbbConfig.inline_new_position, columnId, mdProperty)
            .build();

        await VaultManagerDB.editNoteContent(noteObject);
        await this.persistFrontmatter({ ...context, deletedColumn: columnId });
    }

    /**
     * Edit a column using inline notation
     * @param context 
     * @returns 
     */
    private async inlineColumnEdit(context: EditContext): Promise<void> {
        const {
            file,
            columnId,
            content,
            newValue,
            ddbbConfig,
        } = context;

        const mdProperty = ParseService.parseLiteral(
            newValue,
            InputType.MARKDOWN,
            ddbbConfig,
            true
        )
        const builder = new NoteContentActionBuilder()
            .setContent(content)
            .setFile(file)
            .addInlineRegexStandard(columnId)
            .addRegExpNewValue(`$1 ${mdProperty}`)
            .addInlineRegexParenthesis(columnId)
            .addRegExpNewValue(`$1$2$3 ${mdProperty}$5$6`)
            .addInlineRegexListOrCallout(columnId)
            .addRegExpNewValue(`$1$2$3 ${mdProperty}`)

        if (!builder.isContentEditable()) {
            await this.inlineAddColumn(context);
            return;
        }
        await VaultManagerDB.editNoteContent(builder.build());
        await this.persistFrontmatter({ ...context, deletedColumn: columnId });
    }

    /**
     * Edit a column key using inline notation
     * @param context 
     * @returns 
     */
    private async inlineColumnKey(context: EditContext): Promise<void> {
        const {
            file,
            columnId,
            content,
            newValue,
            rowFields,
        } = context;

        if (!Object.keys(rowFields.inline).contains(columnId)) {
            return;
        }
        const noteObject = new NoteContentActionBuilder()
            .setContent(content)
            .setFile(file)
            .addInlineRegexStandard(columnId)
            .addRegExpNewValue(`${newValue}:: $2`)
            .addInlineRegexParenthesis(columnId)
            .addRegExpNewValue(`$1$2${newValue}:: $4$5$6`)
            .addInlineRegexListOrCallout(columnId)
            .addRegExpNewValue(`$1$2${newValue}:: $4`)
            .build();

        await VaultManagerDB.editNoteContent(noteObject);
        await this.persistFrontmatter(context);
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