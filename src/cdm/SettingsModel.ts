export interface MediaSettings {
    enable_media_view: boolean;
    width: number;
    height: number;
}
/**
 * Options that affects the behavior of the plugin and defines default values with some fields
 */
interface GlobalSettings {
    enable_debug_mode: boolean;
    logger_level_info: string;
    media_settings: MediaSettings;
}
export interface LocalSettings {
    enable_show_state: boolean;
    group_folder_column: string;
    cell_size: string;
    sticky_first_column: boolean;
    remove_field_when_delete_column: boolean;
    show_metadata_created: boolean;
    show_metadata_modified: boolean;
    show_metadata_tasks: boolean;
    source_data: string;
    source_form_result: string;
}

export interface DatabaseSettings {
    global_settings: GlobalSettings;
    local_settings: LocalSettings;
}