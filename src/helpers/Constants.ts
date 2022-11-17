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
  SORTING: 'sorting',
  CALENDAR: 'calendar',
  CALENDAR_TIME: 'calendar_time',
  METATADA_TIME: 'metadata_time',
  TASK: 'task',
  INLINKS: 'inlinks',
  OUTLINKS: 'outlinks',
  CHECKBOX: 'checkbox',
  NEW_COLUMN: 'new_column',
  FORMULA: 'formula',
  RELATION: 'relation',
  ROLLUP: 'rollup',
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
  CHECKBOX: 'Checkbox',
  FORMULA: 'Formula',
  RELATION: 'Relation',
  ROLLUP: 'Rollup',
});

export const DatabaseLimits = Object.freeze({
  MAX_COLUMNS: 100,
  MAX_ROWS: 99999,
  MAX_OPTIONS: 100,
  MIN_COLUMN_HEIGHT: 30,
  MAX_COLUMN_HEIGHT: 350,
});

export const MetadataColumns = Object.freeze({
  FILE: `__file__`,
  CREATED: `__created__`,
  MODIFIED: `__modified__`,
  ADD_COLUMN: `__add_column__`,
  TASKS: `__tasks__`,
  OUTLINKS: `__outlinks__`,
  INLINKS: `__inlinks__`,
  ROW_CONTEXT_MENU: "__rowContextMenu__"
});

export const MetadataLabels = Object.freeze({
  FILE: 'File',
  ADD_COLUMN: '+',
  CREATED: 'Created',
  MODIFIED: 'Modified',
  TASK: 'Task',
  OUTLINKS: 'Outlinks',
  INLINKS: 'Inlinks',
});
/******************************************************************************
 *                          COLUMN CONFIGURATIONS                             *
 ******************************************************************************/
export const COLUMN_ALIGNMENT_OPTIONS = Object.freeze({
  LEFT: 'text-align-left',
  CENTER: 'text-align-center',
  RIGHT: 'text-align-right',
  JUSTIFY: 'text-align-justify',
  NOWRAP: 'text-nowrap',
  WRAP: 'text-wrap',
});

export const DEFAULT_COLUMN_CONFIG: ConfigColumn = Object.freeze({
  enable_media_view: true,
  link_alias_enabled: true,
  media_width: 100,
  media_height: 100,
  isInline: false,
  task_hide_completed: true
});

export const MetadataDatabaseColumns: MetadataColumnsModel = Object.freeze({
  FILE:
  {
    key: MetadataColumns.FILE,
    id: MetadataColumns.FILE,
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
    id: MetadataColumns.ADD_COLUMN,
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
    id: MetadataColumns.CREATED,
    input: InputType.METATADA_TIME,
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
    id: MetadataColumns.MODIFIED,
    input: InputType.METATADA_TIME,
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
    id: MetadataColumns.TASKS,
    input: InputType.TASK,
    label: MetadataLabels.TASK,
    accessorKey: MetadataColumns.TASKS,
    isMetadata: true,
    isDragDisabled: false,
    skipPersist: false,
    csvCandidate: false,
    config: DEFAULT_COLUMN_CONFIG
  },
  INLINKS: {
    key: MetadataColumns.INLINKS,
    id: MetadataColumns.INLINKS,
    input: InputType.INLINKS,
    label: MetadataLabels.INLINKS,
    accessorKey: MetadataColumns.INLINKS,
    isMetadata: true,
    isDragDisabled: false,
    skipPersist: false,
    csvCandidate: false,
    config: DEFAULT_COLUMN_CONFIG
  },
  OUTLINKS: {
    key: MetadataColumns.OUTLINKS,
    id: MetadataColumns.OUTLINKS,
    input: InputType.OUTLINKS,
    label: MetadataLabels.OUTLINKS,
    accessorKey: MetadataColumns.OUTLINKS,
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
    minSize: 15,
    maxSize: 15,
    width: 15,
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
  FILTERS_MODAL: 'database-filters-modal',
  FILTERS_MODAL_BODY: 'database-filters-body',
});


export const StyleVariables = Object.freeze({
  BACKGROUND_MODIFIER_ERROR: 'var(--background-modifier-error)',
  BACKGROUND_MODIFIER_SUCCESS: 'var(--background-modifier-success)',
  BACKGROUND_PRIMARY: 'var(--background-primary)',
  BACKGROUND_SECONDARY: 'var(--background-secondary)',
  BACKGROUND_DIVIDER: 'var(--background-divider)',
  TEXT_FAINT: 'var(--text-faint)',
  TEXT_MUTED: 'var(--text-muted)',
  TEXT_NORMAL: 'var(--text-normal)',
  TEXT_ACCENT_HOVER: 'var(--text-accent-hover)',
  TEXT_ACCENT: 'var(--text-accent)',
  LINK_COLOR: 'var(--link-color)',
  INTERACTIVE_NORMAL: 'var(--interactive-normal)',
  INPUT_SHADOW: 'var(--input-shadow)',
});

export const SourceDataTypes = Object.freeze({
  CURRENT_FOLDER: 'current_folder',
  CURRENT_FOLDER_WITHOUT_SUBFOLDERS: 'current_folder_without_subfolders',
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

/******************************************************************************
 *                            FILTERS
 ******************************************************************************/
export const OperatorFilter = Object.freeze({
  EQUAL: ['EQUAL', '='],
  NOT_EQUAL: ['NOT_EQUAL', '!='],
  GREATER_THAN: ['GREATER_THAN', '>'],
  LESS_THAN: ['LESS_THAN', '<'],
  GREATER_THAN_OR_EQUAL: ['GREATER_THAN_OR_EQUAL', '>='],
  LESS_THAN_OR_EQUAL: ['LESS_THAN_OR_EQUAL', '<='],
  CONTAINS: ['CONTAINS', 'operator_contains'],
  NOT_CONTAINS: ['NOT_CONTAINS', 'operator_does_not_contain'],
  STARTS_WITH: ['STARTS_WITH', 'operator_starts_with'],
  ENDS_WITH: ['ENDS_WITH', 'operator_ends_with'],
  IS_EMPTY: ['IS_EMPTY', 'operator_is_empty'],
  IS_NOT_EMPTY: ['IS_NOT_EMPTY', 'operator_is_not_empty'],
});

export const ConditionFiltersOptions = Object.freeze({
  AND: 'AND',
  OR: 'OR'
});

export function getOperatorFilterValue(keyToFind: string): string {
  const entry = Object.entries(OperatorFilter).find(([key]) =>
    key === keyToFind
  );
  // Check if the key was found
  if (entry) {
    return entry[1][1];
  } else {
    return '';
  }
}

export const MarkdownBreakerRules = Object.freeze({
  INIT_CHARS: ['`', '[', '{', '*', '!', '>'],
  BETWEEN_CHARS: [':', '"', '#'],
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
export const INLINE_POSITION = Object.freeze({
  TOP: 'top',
  BOTTOM: 'bottom',
});

export const DEFAULT_SETTINGS: DatabaseSettings = {
  global_settings: {
    enable_debug_mode: false,
    enable_show_state: false,
    enable_row_shadow: true,
    enable_ribbon_icon: true,
    logger_level_info: 'error',
    csv_file_header_key: 'File',
    media_settings: {
      link_alias_enabled: DEFAULT_COLUMN_CONFIG.link_alias_enabled,
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
    remove_empty_folders: false,
    automatically_group_files: false,
    hoist_files_with_empty_attributes: true,
    show_metadata_created: false,
    show_metadata_modified: false,
    show_metadata_tasks: false,
    show_metadata_inlinks: false,
    show_metadata_outlinks: false,
    source_data: SourceDataTypes.CURRENT_FOLDER,
    source_form_result: 'root',
    source_destination_path: '/',
    frontmatter_quote_wrap: false,
    row_templates_folder: '/',
    current_row_template: '',
    pagination_size: 10,
    enable_js_formulas: false,
    formula_folder_path: '/',
    inline_default: false,
    inline_new_position: INLINE_POSITION.TOP,
    date_format: 'yyyy-MM-dd',
    datetime_format: 'yyyy-MM-dd HH:mm:ss',
  }
};

/******************************************************************************
 *                            DATABASE_CONFIG REGEX
 ******************************************************************************/
export const DATABASE_CONFIG = Object.freeze({
  YAML: /```yaml:dbfolder\s+([\w\W]+?)\s+```/,
  REPLACE_YAML_REGEX: new RegExp('```yaml:dbfolder\\s+([\\w\\W]+?)\\s+```', "g"),
  START_CENTINEL: '```yaml:dbfolder',
  END_CENTINEL: '```',
  START_CENTINEL_LEGACY: '%% dbfolder:yaml',
  END_CENTINEL_LEGACY: '%%',
});

/******************************************************************************
 *                            DATABASE BASE YAML
 ******************************************************************************/
export const DatabaseFrontmatterOptions = Object.freeze({
  BASIC: [
    '---',
    '',
    `${DatabaseCore.FRONTMATTER_KEY}: basic`,
    '',
    '---',
    '',
    DATABASE_CONFIG.START_CENTINEL,
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
    ' enabled: false',
    ' conditions:'
  ].join('\n')
});

/******************************************************************************
 *                            SUGGESTER REGEX
 ******************************************************************************/
export const SUGGESTER_REGEX = Object.freeze({
  LINK: /\B\[\[([^\]]*)$/,
  EMBED: /\B!\[\[([^\]]*)$/,

  LINK_HEADING: /\B\[\[([^#\]]+)#([^\]]*)$/,
  EMBED_HEADING: /\B!\[\[([^#\]]+)#([^\]]*)$/,

  LINK_BLOCK: /\B\[\[([^#\]]+)#?\^([^\]]*)$/,
  EMBED_BLOCK: /\B!\[\[([^#\]]+)#?\^([^\]]*)$/
});

/******************************************************************************
 *                                ICONS
 ******************************************************************************/
export const DB_ICONS = Object.freeze({
  NAME: 'database-folder-icon',
  ICON: `<g transform="translate(0,95) scale(0.03,-0.0275)" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M83 3413 c-12 -2 -36 -17 -53 -33 -26 -25 -30 -35 -30 -83 0 -50 3 -58 35 -86 l36 -31 1499 0 1499 0 28 -24 c27 -23 28 -28 28 -120 0 -86 -2 -98 -23 -118 l-23 -23 -1504 -5 -1504 -5 -35 -34 c-33 -32 -36 -40 -36 -93 0 -56 1 -59 42 -88 l41 -30 1502 0 c1280 0 1504 -2 1521 -14 17 -13 19 -27 19 -120 0 -96 -2 -107 -22 -128 l-23 -22 -1472 2 c-810 1 -1490 -1 -1510 -4 -22 -3 -51 -18 -68 -34 -27 -25 -30 -34 -30 -89 0 -57 2 -61 37 -88 l36 -28 1503 -3 1502 -2 27 -32 c25 -30 27 -37 23 -119 -2 -68 -7 -91 -22 -108 l-19 -21 -1488 0 c-1027 0 -1496 -3 -1516 -11 -15 -5 -40 -22 -55 -37 -23 -21 -28 -34 -28 -75 0 -63 13 -85 63 -108 41 -18 92 -19 1528 -19 1449 0 1487 0 1510 -19 22 -18 24 -26 24 -121 0 -95 -2 -103 -24 -121 -23 -19 -61 -19 -1511 -19 -958 0 -1498 -4 -1515 -10 -50 -19 -75 -58 -75 -116 0 -49 3 -55 37 -83 l38 -31 1475 0 c811 0 1492 -3 1513 -6 56 -10 70 -44 65 -156 -3 -66 -8 -93 -21 -106 -16 -16 -88 -17 -1018 -22 l-1001 -5 -34 -37 c-27 -30 -34 -46 -34 -79 0 -51 11 -72 54 -98 33 -21 37 -21 1029 -21 892 0 997 -2 1011 -16 13 -12 16 -38 16 -120 0 -163 175 -144 -1300 -144 -1247 0 -1260 0 -1280 20 -19 19 -20 33 -20 214 l0 194 -26 32 c-47 56 -66 60 -258 60 l-175 0 -36 -31 c-31 -28 -35 -36 -35 -81 0 -43 4 -54 31 -79 30 -28 36 -29 121 -29 60 0 99 -5 118 -15 17 -9 31 -17 32 -18 0 -1 4 -90 7 -197 7 -226 12 -239 103 -284 l52 -26 1358 0 c1500 0 1396 -4 1466 63 67 64 62 -66 62 1631 0 932 -4 1554 -9 1569 -15 38 -70 96 -115 120 l-41 22 -1540 1 c-847 1 -1550 0 -1562 -3z"/> </g> `
});

export const ROLLUP_EMBED_ACTIONS = {
  ALL_TASKS: 'All Tasks',
  TASK_TODO: 'Task TODO',
  TASK_COMPLETED: 'Task Completed'
};

export const ROLLUP_ACTIONS = Object.freeze({
  // Key is needed for the action to be executed
  SUM: 'Summatory',
  COUNT_ALL: 'Count All',
  COUNT_UNIQUE: 'Count Unique Values',
  ORIGINAL_VALUE: 'Original Value',
  TRUTHY_COUNT: 'Truthy Count',
  FALSY_COUNT: 'Falsy Count',
  PERCENT_EMPTY: 'Percent Empty',
  PERCENT_FILLED: 'Percent Filled',
  // Key is not needed for the action to be executed
  ...ROLLUP_EMBED_ACTIONS
});