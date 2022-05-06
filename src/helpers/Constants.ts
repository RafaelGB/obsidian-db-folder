/** Table Actions */
export const ActionTypes = Object.freeze({
  ADD_OPTION_TO_COLUMN: 'add_option_to_column',
  ADD_ROW: 'add_row',
  UPDATE_COLUMN_TYPE: 'update_column_type',
  UPDATE_COLUMN_LABEL: 'update_column_label',
  UPDATE_CELL: 'update_cell',
  UPDATE_OPTION_CELL: 'update_option_cell',
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
  FILE: `__file__`,
  ADD_COLUMN: `__add_column__`,
});

export const MetadataLabels = Object.freeze({
  FILE: 'File',
  ADD_COLUMN: '+'
});

export const MetadataDatabaseColumns = Object.freeze({
  FILE:
  {
    key: MetadataColumns.FILE,
    input: DataTypes.MARKDOWN,
    Header: MetadataColumns.FILE,
    label: MetadataLabels.FILE,
    accessor: MetadataColumns.FILE,
    isMetadata: true,
    skipPersist: false,
    csvCandidate: true,
  },
  ADD_COLUMN: {
    key: MetadataColumns.ADD_COLUMN,
    Header: MetadataColumns.ADD_COLUMN,
    input: DataTypes.NEW_COLUMN,
    width: 20,
    disableResizing: true,
    label: MetadataLabels.ADD_COLUMN,
    accessor: MetadataColumns.ADD_COLUMN,
    isMetadata: true,
    skipPersist: true,
    csvCandidate: false,
  }
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
  INLINE_VALUE: 'inline_value',
  REMOVE_COLUMN: 'remove_column'
});

export const StyleClasses = Object.freeze({
  TABLE_CONTAINER: 'dbfolder-table-container',
  SETTINGS_MODAL: 'database-settings-modal',
  SETTINGS_MODAL_BODY: 'database-settings-body',
});

export const StyleVariables = Object.freeze({
  BACKGROUND_MODIFIER_ERROR: 'var(--background-modifier-error)',
  BACKGROUND_PRIMARY: 'var(--background-primary)',
  BACKGROUND_SECONDARY: 'var(--background-secondary)',
  BACKGROUND_DIVIDER: 'var(--background-divider)',
  TEXT_FAINT: 'var(--text-faint)',
  TEXT_NORMAL: 'var(--text-normal)',
});

export const WidthVariables = Object.freeze({
  ICON_SPACING: 15,
  MAGIC_SPACING: 10
});