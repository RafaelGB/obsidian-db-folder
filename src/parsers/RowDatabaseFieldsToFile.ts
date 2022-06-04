import { RowDatabaseFields } from "cdm/DatabaseModel";
import { DataTypes } from "helpers/Constants";
import { Literal } from "obsidian-dataview/lib/data-model/value";
import { DataviewService } from "services/DataviewService";
export const parseFrontmatterFieldsToString = (databaseFields: RowDatabaseFields, deletedColumn?: string): string => {
    const frontmatterFields = databaseFields.frontmatter;
    const array: string[] = [];
    array.push(`---`);
    Object.keys(frontmatterFields).forEach(key => {
        if (key !== deletedColumn) {
            array.push(...parseLiteralToString(frontmatterFields[key], 0, key));
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

function parseLiteralToString(literal: Literal, level: number, key?: string): string[] {
    const literalBlock: string[] = [];
    literal = DataviewService.parseDataArray(literal);
    // Manage Arrays
    if (DataviewService.getDataviewAPI().value.isArray(literal)) {
        literalBlock.push(`${" ".repeat(level)}${key}:`);
        literal.forEach((literal, index) => {
            literalBlock.push(...parseLiteralToString(literal, level + 1));
        });
    }
    else if (key) {
        literalBlock.push(`${" ".repeat(level)}${key}: ${DataviewService.parseLiteral(literal, DataTypes.MARKDOWN)}`);
    } else {
        literalBlock.push(`${" ".repeat(level)}- ${DataviewService.parseLiteral(literal, DataTypes.MARKDOWN)}`);
    }
    return literalBlock;
}