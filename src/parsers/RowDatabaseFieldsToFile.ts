import { RowDatabaseFields } from "cdm/DatabaseModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataTypes } from "helpers/Constants";
import { Literal } from "obsidian-dataview/lib/data-model/value";
import { DataviewService } from "services/DataviewService";
export const parseFrontmatterFieldsToString = (databaseFields: RowDatabaseFields, localSettings: LocalSettings, deletedColumn?: string): string => {
    const frontmatterFields = databaseFields.frontmatter;
    const array: string[] = [];
    array.push(`---`);
    Object.keys(frontmatterFields).forEach(key => {
        if (key !== deletedColumn) {
            array.push(...parseLiteralToString(frontmatterFields[key], 0, localSettings, key));
        }
    });
    array.push(`---`);
    return array.join('\n');
}

export const parseInlineFieldsToString = (inlineFields: RowDatabaseFields): string => {
    const array: string[] = [];
    Object.keys(inlineFields.inline).forEach(key => {
        array.push(`${key}:: ${inlineFields.inline[key]}`);
    });
    return array.join('\n');
}

function parseLiteralToString(literal: Literal, level: number, localSettings: LocalSettings, key?: string): string[] {
    const literalBlock: string[] = [];
    literal = DataviewService.parseDataArray(literal);
    // Manage Arrays
    if (DataviewService.getDataviewAPI().value.isArray(literal)) {
        literalBlock.push(`${" ".repeat(level)}${key}:`);
        literal.forEach((literal, index) => {
            literalBlock.push(...parseLiteralToString(literal, level + 1, localSettings));
        });
    }
    else if (key) {
        literalBlock.push(`${" ".repeat(level)}${key}: ${wrapWithQuotes(DataviewService.parseLiteral(literal, DataTypes.MARKDOWN), localSettings.frontmatter_quote_wrap)}`);
    } else {
        literalBlock.push(`${" ".repeat(level)}- ${wrapWithQuotes(DataviewService.parseLiteral(literal, DataTypes.MARKDOWN), localSettings.frontmatter_quote_wrap)}`);
    }
    return literalBlock;
}

function wrapWithQuotes(literal: Literal, isWrapActivated: boolean): string {
    if (!literal.toString().startsWith('"') && !literal.toString().endsWith('"') && isWrapActivated) {
        return `\"${literal.toString()}\"`;
    }
    return literal.toString();
}