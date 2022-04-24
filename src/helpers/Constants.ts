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

/** Flavours of data types */
export const DataTypes = Object.freeze({
    NUMBER: 'number',
    TEXT: 'text',
    SELECT: 'select',
    MARKDOWN: 'markdown',
    NEW_COLUMN: 'new_column'
  });

export const MAX_CAPACITY_DATABASE = 999999;

export const MetadataColumns = Object.freeze({
  FILE: `${MAX_CAPACITY_DATABASE-1}`,
  ADD_COLUMN: `${MAX_CAPACITY_DATABASE}`
});

export const MetadataLabels = Object.freeze({
  FILE: 'File',
  ADD_COLUMN: 'Add Column'
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
    ' column1:',
    '  input: text',
    '  key: column1',
    '  accessor: column1',
    '  label: Column 1',
    '  position: 0',
  ].join('\n')
});

export const UpdateRowOptions = Object.freeze({
  COLUMN_VALUE: 'column_value',
  COLUMN_KEY: 'column_key',
  REMOVE_COLUMN: 'remove_column',
  ADD_COLUMN: 'add_column'
});

export const StyleClasses = Object.freeze({
  TABLE_CONTAINER: 'dbfolder-table-container',
});