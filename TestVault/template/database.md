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
    accessorkey: __file__
    isMetadata: true
    skipPersist: false
    isDragDisabled: false
    csvCandidate: true
    position: 1
    config:
  text_column:
    input: text
    accessorkey: text_column
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
    accessorkey: selected_column
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
    accessorkey: number_column
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
    accessorkey: Datetime_column
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
    accessorkey: Date_column
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
    accessorkey: __created__
    isMetadata: true
    isDragDisabled: false
    skipPersist: false
    csvCandidate: true
    position: 8
    config:
  __modified__:
    key: __modified__
    input: calendar_time
    label: Modified
    accessorkey: __modified__
    isMetadata: true
    isDragDisabled: false
    skipPersist: false
    csvCandidate: true
    position: 9
    config:
  checkbox_column:
    input: checkbox
    accessorkey: checkbox_column
    key: checkbox_column
    label: checkbox column
    position: 7
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      source_data: current_folder
  tags_column:
    input: tags
    accessorkey: tags_column
    key: tags_column
    label: tags column
    position: 4
    options:
      - { label: "new tag", backgroundColor: "hsl(247, 95%, 90%)"}
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
  cell_size: normal
  sticky_first_column: false
  show_metadata_created: true
  show_metadata_modified: true
  source_data: current_folder
  source_form_result: 
  show_metadata_tasks: true
filters:
%%>