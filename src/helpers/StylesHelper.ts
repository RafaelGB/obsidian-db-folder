import { ConfigColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { CellSizeOptions, COLUMN_ALIGNMENT_OPTIONS, DatabaseCore, MetadataLabels } from "helpers/Constants";

/**
 * Wrap the classname of css elements
 * @param className 
 * @returns 
 */
export function c(className: string): string {
    const wrappedClasses: string[] = [];
    className.split(' ').forEach((cls) => {
        wrappedClasses.push(`${DatabaseCore.FRONTMATTER_KEY}__${cls}`);
    });
    return wrappedClasses.join(' ');
}

/** Generate random key ids */
export function shortId() {
    return '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Given a string, parse it to be key candidate
 * @param str
 * @returns {string}
 */
export function dbTrim(str: string) {
    return str.trim().replaceAll("\n", "").replaceAll("\t", "").replaceAll(" ", "_");
}

/**
 * Obtain label associated with a header type
 * @param dataType 
 * @returns 
 */
export function getLabelHeader(input: string) {
    const labelCandidate = Object.entries(MetadataLabels).find(([key]) => {
        if (key === input.toUpperCase()) {
            return true;
        }
    });
    return labelCandidate === undefined ? input : labelCandidate[1];
}

export function getAlignmentClassname(configColumn: ConfigColumn, localSettings: LocalSettings) {
    const classes: string[] = [];
    classes.push(
        configColumn.content_alignment === undefined ?
            COLUMN_ALIGNMENT_OPTIONS.LEFT :
            configColumn.content_alignment
    );
    classes.push(
        (configColumn.wrap_content && localSettings.cell_size !== CellSizeOptions.COMPACT) ?
            COLUMN_ALIGNMENT_OPTIONS.WRAP :
            COLUMN_ALIGNMENT_OPTIONS.NOWRAP
    );
    return classes.join(' ');
}