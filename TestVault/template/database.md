---

database-plugin: basic

---

<%%
name: new database
description: new description
columns:
  __file__:
    key: __file__
    input: markdown
    label: File
    accessor: __file__
    isMetadata: true
    skipPersist: false
    csvCandidate: true
    position: 1
    config:
  text_column:
    input: text
    accessor: text_column
    key: text_column
    label: text column
    position: 2
    config:
      isInline: false
      media_height: 100
      media_width: 100
      enable_media_view: false
  selected_column:
    input: select
    accessor: selected_column
    key: selected_column
    label: selected column
    position: 3
    options:
    config:
      isInline: false
      media_height: 100
      media_width: 100
      enable_media_view: false
  number_column:
    input: number
    accessor: number_column
    key: number_column
    label: number column
    position: 4
    config:
      isInline: false
      media_height: 100
      media_width: 100
      enable_media_view: false
  Datetime_column:
    input: calendar_time
    accessor: Datetime_column
    key: Datetime_column
    label: Datetime column
    position: 6
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      source_data: current_folder
  Date_column:
    input: calendar
    accessor: Date_column
    key: Date_column
    label: Date column
    position: 5
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      source_data: current_folder
  __created__:
    key: __created__
    input: calendar_time
    label: Created
    accessor: __created__
    isMetadata: true
    skipPersist: false
    csvCandidate: true
    position: 8
    config:
  __modified__:
    key: __modified__
    input: calendar_time
    label: Modified
    accessor: __modified__
    isMetadata: true
    skipPersist: false
    csvCandidate: true
    position: 9
    config:
  checkbox_column:
    input: checkbox
    accessor: checkbox_column
    key: checkbox_column
    label: checkbox column
    position: 7
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      source_data: current_folder
config:
  enable_show_state: false
  group_folder_column: 
  remove_field_when_delete_column: true
  show_metadata_created: true
  show_metadata_modified: true
  source_data: current_folder
  source_form_result: 
  show_metadata_tasks: true
filters:
%%>