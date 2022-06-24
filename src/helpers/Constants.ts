import { MetadataColumnsModel } from "cdm/DatabaseModel";
import { TableColumn } from "cdm/FolderModel";
import { DatabaseSettings } from "cdm/SettingsModel";

/** Table Actions */
export const ActionTypes = Object.freeze({
  ADD_OPTION_TO_COLUMN: 'add_option_to_column',
  ADD_ROW: 'add_row',
  CHANGE_ROW_TEMPLATE: 'change_row_template',
  UPDATE_COLUMN_TYPE: 'update_column_type',
  UPDATE_COLUMN_LABEL: 'update_column_label',
  UPDATE_CELL: 'update_cell',
  UPDATE_OPTION_CELL: 'update_option_cell',
  ADD_COLUMN_TO_LEFT: 'add_column_to_left',
  ADD_COLUMN_TO_RIGHT: 'add_column_to_right',
  DELETE_COLUMN: 'delete_column',
  ENABLE_RESET: 'enable_reset',
  SETTINGS_COLUMN: 'settings_column',
  MODIFY_COLUMN_CONFIG: 'modify_column_config',
  SET_SORT_BY: 'set_sort_by',
});

/** Flavours of data types */
export const DataTypes = Object.freeze({
  NUMBER: 'number',
  TEXT: 'text',
  SELECT: 'select',
  TAGS: 'tags',
  MARKDOWN: 'markdown',
  CALENDAR: 'calendar',
  CALENDAR_TIME: 'calendar_time',
  TASK: 'task',
  CHECKBOX: 'checkbox',
  NEW_COLUMN: 'new_column'
});

export const MaxCapacitiesDatabase = Object.freeze({
  MAX_COLUMNS: 100,
  MAX_ROWS: 99999,
  MAX_OPTIONS: 100,
});

export const MetadataColumns = Object.freeze({
  FILE: `__file__`,
  CREATED: `__created__`,
  MODIFIED: `__modified__`,
  ADD_COLUMN: `__add_column__`,
  TASKS: `__tasks__`
});

export const MetadataLabels = Object.freeze({
  FILE: 'File',
  ADD_COLUMN: '+',
  CREATED: 'Created',
  MODIFIED: 'Modified',
  CALENDAR: 'Date',
  CALENDAR_TIME: 'Datetime',
  TASK: 'Task',
});

export const DEFAULT_COLUMN_CONFIG = Object.freeze({
  enable_media_view: true,
  media_width: 100,
  media_height: 100,
  isInline: false,
  source_data: 'current_folder',
});

export const MetadataDatabaseColumns: MetadataColumnsModel = Object.freeze({
  FILE:
  {
    key: MetadataColumns.FILE,
    input: DataTypes.MARKDOWN,
    label: MetadataLabels.FILE,
    accessor: MetadataColumns.FILE,
    isMetadata: true,
    skipPersist: false,
    isDragDisabled: false,
    csvCandidate: true,
    config: {
      ...DEFAULT_COLUMN_CONFIG,
      isInline: true,
    }
  },
  ADD_COLUMN: {
    key: MetadataColumns.ADD_COLUMN,
    input: DataTypes.NEW_COLUMN,
    label: MetadataLabels.ADD_COLUMN,
    accessor: MetadataColumns.ADD_COLUMN,
    isMetadata: true,
    isDragDisabled: true,
    skipPersist: true,
    csvCandidate: false,
    config: DEFAULT_COLUMN_CONFIG
  },
  CREATED: {
    key: MetadataColumns.CREATED,
    input: DataTypes.CALENDAR_TIME,
    label: MetadataLabels.CREATED,
    accessor: MetadataColumns.CREATED,
    isMetadata: true,
    isDragDisabled: false,
    skipPersist: false,
    csvCandidate: true,
    config: DEFAULT_COLUMN_CONFIG
  },
  MODIFIED: {
    key: MetadataColumns.MODIFIED,
    input: DataTypes.CALENDAR_TIME,
    label: MetadataLabels.MODIFIED,
    accessor: MetadataColumns.MODIFIED,
    isMetadata: true,
    isDragDisabled: false,
    skipPersist: false,
    csvCandidate: true,
    config: DEFAULT_COLUMN_CONFIG
  },
  TASKS: {
    key: MetadataColumns.TASKS,
    input: DataTypes.TASK,
    label: MetadataLabels.TASK,
    accessor: MetadataColumns.TASKS,
    isMetadata: true,
    isDragDisabled: false,
    skipPersist: true,
    csvCandidate: false,
    config: DEFAULT_COLUMN_CONFIG
  },
});

export const TableColumnsTemplate: Partial<TableColumn> =
{
  isMetadata: false,
  skipPersist: false,
  isDragDisabled: false,
  options: [],
  csvCandidate: true,
}

export const DatabaseCore = Object.freeze({
  FRONTMATTER_KEY: 'database-plugin',
  DATAVIEW_FILE: 'file',
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
    'name: new database',
    'description: new description',
    'columns:',
    ' column1:',
    '  input: text',
    '  key: column1',
    '  accessor: column1',
    '  label: Column 1',
    '  position: 0',
    '  config:',
    '   enable_media_view: true',
    '   media_width: 100',
    '   media_height: 100',
    '   isInline: false',
    'filters:',
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
  COLUMN_MODAL: 'database-column-modal',
  COLUMN_MODAL_BODY: 'database-column-body',
});


export const StyleVariables = Object.freeze({
  BACKGROUND_MODIFIER_ERROR: 'var(--background-modifier-error)',
  BACKGROUND_PRIMARY: 'var(--background-primary)',
  BACKGROUND_SECONDARY: 'var(--background-secondary)',
  BACKGROUND_DIVIDER: 'var(--background-divider)',
  TEXT_FAINT: 'var(--text-faint)',
  TEXT_MUTED: 'var(--text-muted)',
  TEXT_NORMAL: 'var(--text-normal)',
});

export const SourceDataTypes = Object.freeze({
  CURRENT_FOLDER: 'current_folder',
  TAG: 'tag',
  OUTGOING_LINK: 'outgoing_link',
  INCOMING_LINK: 'incoming_link',
  QUERY: 'query',
});


export const CellSizeOptions = Object.freeze({
  COMPACT: 'compact',
  NORMAL: 'normal',
  WIDE: 'wide'
})


export const WidthVariables = Object.freeze({
  ICON_SPACING: 17,
  MAGIC_SPACING: 10
});

export const OperatorFilter = Object.freeze({
  EQUAL: '=',
  NOT_EQUAL: '!=',
  GREATER_THAN: '>',
  LESS_THAN: '<',
  GREATER_THAN_OR_EQUAL: '>=',
  LESS_THAN_OR_EQUAL: '<=',
  CONTAINS: 'contains',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with',
});

export function getOperatorFilterValue(keyToFind: string): string {
  const entry = Object.entries(OperatorFilter).find(([key]) =>
    key === keyToFind
  );
  // Check if the key was found
  if (entry) {
    return entry[1];
  } else {
    return '';
  }
}

export const MarkdownBreakerRules = Object.freeze({
  INIT_CHARS: ['`', '\"', '[', '{', '*'],
  BETWEEN_CHARS: [':'],
  UNIQUE_CHARS: ['?'],
})


export const MediaExtensions = Object.freeze({
  IMAGE: ['bmp', 'png', 'jpg', 'jpeg', 'gif', 'svg'],
  VIDEO: ['mp4', 'webm', 'ogv'],
  AUDIO: ['mp3', 'wav', 'm4a', '3gp', 'flac', 'ogg', 'oga']
});

export const YAML_INDENT = Object.freeze("  ");

/******************************************************************************
 *                          SETTINGS CONSTANTS
 ******************************************************************************/
export const DEFAULT_SETTINGS: DatabaseSettings = {
  global_settings: {
    enable_debug_mode: false,
    logger_level_info: 'error',
    media_settings: {
      enable_media_view: DEFAULT_COLUMN_CONFIG.enable_media_view,
      width: DEFAULT_COLUMN_CONFIG.media_height,
      height: DEFAULT_COLUMN_CONFIG.media_height
    }
  },
  local_settings: {
    enable_show_state: false,
    remove_field_when_delete_column: false,
    cell_size: CellSizeOptions.NORMAL,
    sticky_first_column: false,
    group_folder_column: '',
    show_metadata_created: false,
    show_metadata_modified: false,
    show_metadata_tasks: false,
    source_data: SourceDataTypes.CURRENT_FOLDER,
    source_form_result: 'root',
    frontmatter_quote_wrap: false,
    row_templates_folder: '/',
    current_row_template: '',
  }
};