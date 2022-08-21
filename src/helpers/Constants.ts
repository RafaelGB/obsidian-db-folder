import { DatabaseColumn, MetadataColumnsModel } from "cdm/DatabaseModel";
import { ConfigColumn, TableColumn } from "cdm/FolderModel";
import { DatabaseSettings } from "cdm/SettingsModel";

/** Table Actions */
export const ActionTypes = Object.freeze({
  UPDATE_COLUMN_LABEL: 'update_column_label',
  ENABLE_RESET: 'enable_reset',
});

/** Flavours of data types */
export const InputType = Object.freeze({
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

export const InputLabel = Object.freeze({
  NUMBER: 'Number',
  TEXT: 'Text',
  SELECT: 'Select',
  TAGS: 'Tags',
  MARKDOWN: 'Markdown',
  CALENDAR: 'Date',
  CALENDAR_TIME: 'Datetime',
  TASK: 'Task',
  CHECKBOX: 'Checkbox'
});

export const DatabaseLimits = Object.freeze({
  MAX_COLUMNS: 100,
  MAX_ROWS: 99999,
  MAX_OPTIONS: 100,
  MIN_COLUMN_HEIGHT: 30,
  MAX_COLUMN_HEIGHT: 350,
});

export const NavBarConfig = Object.freeze({
  ITEM_HEIGHT: 48,
});

export const MetadataColumns = Object.freeze({
  FILE: `__file__`,
  CREATED: `__created__`,
  MODIFIED: `__modified__`,
  ADD_COLUMN: `__add_column__`,
  TASKS: `__tasks__`,
  ROW_CONTEXT_MENU: "__rowContextMenu__"
});

export const MetadataLabels = Object.freeze({
  FILE: 'File',
  ADD_COLUMN: '+',
  CREATED: 'Created',
  MODIFIED: 'Modified',
  TASK: 'Task',
});

export const DEFAULT_COLUMN_CONFIG: ConfigColumn = Object.freeze({
  enable_media_view: true,
  media_width: 100,
  media_height: 100,
  isInline: false,
  task_hide_completed: true,
});

export const MetadataDatabaseColumns: MetadataColumnsModel = Object.freeze({
  FILE:
  {
    key: MetadataColumns.FILE,
    input: InputType.MARKDOWN,
    label: MetadataLabels.FILE,
    accessorKey: MetadataColumns.FILE,
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
    input: InputType.NEW_COLUMN,
    label: MetadataLabels.ADD_COLUMN,
    accessorKey: MetadataColumns.ADD_COLUMN,
    isMetadata: true,
    isDragDisabled: true,
    skipPersist: true,
    csvCandidate: false,
    config: DEFAULT_COLUMN_CONFIG
  },
  CREATED: {
    key: MetadataColumns.CREATED,
    input: InputType.CALENDAR_TIME,
    label: MetadataLabels.CREATED,
    accessorKey: MetadataColumns.CREATED,
    isMetadata: true,
    isDragDisabled: false,
    skipPersist: false,
    csvCandidate: true,
    config: DEFAULT_COLUMN_CONFIG
  },
  MODIFIED: {
    key: MetadataColumns.MODIFIED,
    input: InputType.CALENDAR_TIME,
    label: MetadataLabels.MODIFIED,
    accessorKey: MetadataColumns.MODIFIED,
    isMetadata: true,
    isDragDisabled: false,
    skipPersist: false,
    csvCandidate: true,
    config: DEFAULT_COLUMN_CONFIG
  },
  TASKS: {
    key: MetadataColumns.TASKS,
    input: InputType.TASK,
    label: MetadataLabels.TASK,
    accessorKey: MetadataColumns.TASKS,
    isMetadata: true,
    isDragDisabled: false,
    skipPersist: false,
    csvCandidate: false,
    config: DEFAULT_COLUMN_CONFIG
  },
  ROW_CONTEXT_MENU: {
    id: MetadataColumns.ROW_CONTEXT_MENU,
    key: MetadataColumns.ROW_CONTEXT_MENU,
    input: InputType.CHECKBOX,
    label: MetadataColumns.ROW_CONTEXT_MENU,
    accessorKey: MetadataColumns.ROW_CONTEXT_MENU,
    isMetadata: true,
    isDragDisabled: true,
    skipPersist: true,
    csvCandidate: false,
    width: 20,
    config: DEFAULT_COLUMN_CONFIG
  }
});

export const TableColumnsTemplate: Pick<DatabaseColumn | TableColumn, "isMetadata" | "skipPersist" | "isDragDisabled" | "options" | "csvCandidate" | "input" | "config"> =
{
  isMetadata: false,
  skipPersist: false,
  isDragDisabled: false,
  options: [],
  csvCandidate: true,
  input: InputType.TEXT,
  config: DEFAULT_COLUMN_CONFIG
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
    '  accessorKey: column1',
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
  ADD_COLUMN_MODAL: 'database-add-column-modal',
  ADD_COLUMN_MODAL_BODY: 'database-add-column-body',
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

export const DnDConfiguration = Object.freeze({
  DRAG_TYPE: "dbFolderColumn",
});

export const ResizeConfiguration = Object.freeze({
  RESIZE_MODE: "onChange",
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
  INIT_CHARS: ['`', '"', '[', '{', '*'],
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
    enable_dnd: false,
    enable_show_state: false,
    logger_level_info: 'error',
    media_settings: {
      enable_media_view: DEFAULT_COLUMN_CONFIG.enable_media_view,
      width: DEFAULT_COLUMN_CONFIG.media_height,
      height: DEFAULT_COLUMN_CONFIG.media_height
    }
  },
  local_settings: {
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