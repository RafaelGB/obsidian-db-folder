export const ActionTypes = Object.freeze({
    ADD_OPTION_TO_COLUMN: 'add_option_to_column',
    ADD_ROW: 'add_row',
    UPDATE_COLUMN_TYPE: 'update_column_type',
    UPDATE_COLUMN_HEADER: 'update_column_header',
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
  });

  export function shortId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }