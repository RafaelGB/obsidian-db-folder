import { RowDatabaseFields } from "cdm/DatabaseModel";
import { LocalSettings } from "cdm/SettingsModel";
import { InputType } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { DateTime } from "luxon";
import { DataviewService } from "services/DataviewService";
import { ParseService } from "services/ParseService";
export const parseFrontmatterFieldsToString = (databaseFields: RowDatabaseFields, localSettings: LocalSettings, deletedColumn?: string): string => {
    const frontmatterFields = databaseFields.frontmatter;
    let array: string[] = [];
    Object.keys(frontmatterFields).forEach(key => {
        if (key !== deletedColumn) {
            array.push(...stringifyDbYaml(frontmatterFields[key], 0, localSettings, key));
        }
    });
    if (array.length > 0) {
        array = [`---`, ...array, `---`];
    }
    return array.join('\n');
};

export const parseInlineFieldsToString = (inlineFields: RowDatabaseFields): string => {
    const array: string[] = [];
    Object.keys(inlineFields.inline).forEach(key => {
        array.push(`${key}:: ${inlineFields.inline[key]}`);
    });
    return array.join('\n');
}

export function parseValuetoSanitizeYamlValue(value: string, localSettings: LocalSettings): string {
    return ParseService.parseLiteral(value, InputType.MARKDOWN, localSettings).toString();
}

function stringifyDbYaml(literal: Literal, level: number, localSettings: LocalSettings, key?: string): string[] {
    const literalBlock: string[] = [];
    literal = ParseService.parseDataArray(literal);
    // Manage Arrays
    if (DataviewService.getDataviewAPI().value.isArray(literal)) {
        literalBlock.push(`${" ".repeat(level)}${key}:`);
        literal.forEach((literal) => {
            literalBlock.push(...stringifyDbYaml(literal, level + 1, localSettings));
        });
    }
    // Manage Dates
    else if (DateTime.isDateTime(literal)) {
        literalBlock.push(`${" ".repeat(level)}${key}: ${ParseService.parseLiteral(literal, InputType.MARKDOWN, localSettings)}`);
    }
    // Manage Objects
    else if (DataviewService.getDataviewAPI().value.isObject(literal)) {

        literalBlock.push(`${" ".repeat(level)}${key}:`);
        Object.entries(literal).forEach(([key, value]) => {
            literalBlock.push(...stringifyDbYaml(value, level + 1, localSettings, key));
        }
        );
    }
    // Manage atomic values
    else if (key) {
        literalBlock.push(`${" ".repeat(level)}${key}: ${ParseService.parseLiteral(literal, InputType.MARKDOWN, localSettings)}`);
    } else {
        literalBlock.push(`${" ".repeat(level)}- ${ParseService.parseLiteral(literal, InputType.MARKDOWN, { ...localSettings, frontmatter_quote_wrap: true })}`);
    }
    return literalBlock;
}