export interface MediaSettings {
    enable_media_view: boolean;
    link_alias_enabled: boolean;
    width: number;
    height: number;
}

export type FilterGroup = AtomicFilter | FilterGroupCondition;

export type FilterGroupCondition = {
    condition: string;
    disabled: boolean;
    filters: FilterGroup[];
}
export type AtomicFilter = {
    field: string;
    operator: string;
    value?: any;
}
/**
 * Options that affects the behavior of the plugin and defines default values with some fields
 */
export interface GlobalSettings {
    enable_debug_mode: boolean;
    logger_level_info: string;
    media_settings: MediaSettings;
    enable_show_state: boolean;
    csv_file_header_key: string;
}

export interface LocalSettings {
    cell_size: string;
    current_row_template: string;
    group_folder_column: string;
    frontmatter_quote_wrap: boolean;
    pagination_size: number;
    remove_field_when_delete_column: boolean;
    show_metadata_created: boolean;
    show_metadata_modified: boolean;
    show_metadata_tasks: boolean;
    show_metadata_inlinks: boolean;
    show_metadata_outlinks: boolean;
    source_form_result: string;
    source_destination_path: string;
    source_data: string;
    sticky_first_column: boolean;
    row_templates_folder: string;
    formula_folder_path: string;
    inline_default: boolean;
    inline_new_position: string;
    date_format: string;
    datetime_format: string;
}

export interface FilterSettings {
    enabled: boolean;
    conditions: FilterGroup[];
}

export interface DatabaseSettings {
    global_settings: GlobalSettings;
    local_settings: LocalSettings;
}