/** Table Actions */
export const ActionTypes = Object.freeze({
    ADD_OPTION_TO_COLUMN: 'add_option_to_column',
    ADD_ROW: 'add_row',
    UPDATE_COLUMN_TYPE: 'update_column_type',
    UPDATE_COLUMN_LABEL: 'update_column_label',
    UPDATE_CELL: 'update_cell',
    ADD_COLUMN_TO_LEFT: 'add_column_to_left',
    ADD_COLUMN_TO_RIGHT: 'add_column_to_right',
    DELETE_COLUMN: 'delete_column',
    ENABLE_RESET: 'enable_reset',
});
  
export const DataTypes = Object.freeze({
    NUMBER: 'number',
    TEXT: 'text',
    SELECT: 'select',
    MARKDOWN: 'markdown'
  });

export const MetadataColumns = Object.freeze({
  FILE: 'file'
});

export const DatabaseCore = Object.freeze({
FRONTMATTER_KEY: 'database-plugin'
});

export const DatabaseFrontmatterOptions = Object.freeze({
  BASIC: [
    '---',
    '',
    `${DatabaseCore.FRONTMATTER_KEY}: basic`,
    '',
    '---',
    '',
    '<%%',
    'columns:',
    ' 0:',
    '  input: text',
    '  key: column1',
    '  accessor: column1',
    '  label: Column 1',
    '%%>'
  ].join('\n')
});

export const UpdateRowOptions = Object.freeze({
  COLUMN_VALUE: 'column_value',
  COLUMN_KEY: 'column_key',
  REMOVE_COLUMN: 'remove_column'
});

export function shortId() {
  return '_' + Math.random().toString(36).substring(2, 9);
}