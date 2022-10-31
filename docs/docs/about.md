## Whats inside the database view?
Database view read the yaml configuration inside `.md` file and render a react DOM.

You can edit directly the yaml configuration inside the `.md` file or use the table features to edit the columns.
### Information
Details about your database

- **name**: Name asociated to your database.
- **description**: extra information explaining the purpose of the database. Will be displated in preview mode.
### Database
The *columns* key is used to charge the correct information when you charge the react-table. Each column supports all the literals of react-table column configurations.

Mandatory:

- **input**: indicates the type of the column (text,markdown & number)
- **key**: name of obsidian field metadata in your notes (inline not supported edition yet)
- **accessor**: is the key of the data. Must be unique
- **label**: name of the column

Optional:

- **position**: order of the columns
- **options**: list of options for the column (only for select type)

Configuration:

- **isInline**: true if you want to edit the field inline mode
- **enable_media_view**: true if you want to see the media view (only for text type)
  - **media_width**: width of the media view
  - **media_height**: height of the media view


### Local configuration
Each database has a yaml local configuration that is read when you open the database.

```markdown
---

database-plugin: basic

---

```yaml:dbfolder
name: Entertaiment
description: All media contain that I consume
columns:
  Calification:
    input: select
    accessor: Calification
    label: Calification
    key: Calification
    position: 5
    enable_media_view: true
    media_width: 100
    media_height: 100
    isInline: false
    isSorted: false
    isSortedDesc: false
    options:
      - { label: "⭐️⭐️⭐️⭐️⭐️", backgroundColor: "hsl(0,62.66650406270436%,57.196614999999994%)"}
      - { label: "⭐️⭐️⭐️⭐️", backgroundColor: "hsl(305, 95%, 90%)"}
      - { label: "⭐️⭐️⭐️", backgroundColor: "hsl(116, 95%, 90%)"}
      - { label: "⭐️⭐️", backgroundColor: "hsl(185, 95%, 90%)"}
      - { label: "⭐️", backgroundColor: "hsl(78, 95%, 90%)"}
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
  director:
    input: text
    accessor: director
    label: director
    key: director
    position: 4
    enable_media_view: true
    media_width: 100
    media_height: 100
    isInline: false
    isSorted: false
    isSortedDesc: true
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
  Year:
    input: number
    accessor: Year
    label: Year
    key: Year
    position: 7
    isSorted: false
    isSortedDesc: false
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
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
  title:
    input: text
    accessor: title
    label: title
    key: title
    position: 6
    isSorted: false
    isSortedDesc: true
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
  Watched_at:
    input: calendar
    accessor: Watched_at
    key: Watched_at
    label: Watched_at
    position: 3
    isSorted: true
    isSortedDesc: true
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
  viewed:
    input: checkbox
    accessor: viewed
    key: viewed
    label: viewed
    position: 2
    enable_media_view: true
    media_width: 100
    media_height: 100
    isInline: false
    media_togle_promise: true
    isSorted: false
    isSortedDesc: false
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      media_togle_promise: true
config:
  enable_show_state: false
  group_folder_column: none
  cell_size: normal
  sticky_first_column: false
  remove_field_when_delete_column: true
  show_metadata_created: false
  show_metadata_modified: false
  media_settings:
    enable_media_view: true
    width: 100
    height: 100
  show_metadata_tasks: true
  source_data: current_folder
  source_form_result: zettelcaster/meet
filters:
```
