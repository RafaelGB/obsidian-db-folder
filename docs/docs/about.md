## Whats inside the database view?
Database view read the yaml configuration inside `.md` file and render a react DOM.

You can edit directly the yaml configuration inside the `.md` file or use the table features to edit the columns.
### Information
Details about your database
- **name**: Name asociated to your database (TODO)
- **description**: extra information explaining the purpose of the database (TODO)
### Database
The *columns* key is used to charge the correct information when you charge the react-table. Each column supports all the literals of react-table column configurations. 
Mandatory:
- **input**: indicates the type of the column (text,markdown & number)
- **key**: name of obsidian field metadata in your notes (inline not supported edition yet)
- **accessor**: is the key of the data. Must be unique
- **label**: name of the column
Optional:
- **position**: order of the columns
- **isInline**: true if you want to edit the field inline mode


### Local configuration
Each database has a yaml local configuration that is read when you open the database.

```markdown
---

database-plugin: basic

---
<%%
name: Entertaiment
description: All media contain that I consume
columns:
  view_state:
    input: select
    accessor: view_state
    key: view_state
    label: view_state
    position: 3
    isInline: false
  Calification:
    input: select
    accessor: Calification
    label: Calification
    key: Calification
    position: 7
    isInline: true
  director:
    input: text
    accessor: director
    label: director
    key: director
    position: 4
  Year:
    input: number
    accessor: Year
    label: Year
    key: Year
    position: 6
  __file__:
    key: __file__
    input: markdown
    label: File
    accessor: __file__
    isMetadata: true
    skipPersist: false
    csvCandidate: true
    isInline: false
    position: 1
  title:
    input: text
    accessor: title
    label: title
    key: title
    position: 5
    isInline: false
  Watched_at:
    input: calendar
    accessor: Watched_at
    key: Watched_at
    label: Watched_at
    position: 2
  __created__:
    key: __created__
    input: calendar
    label: Created
    accessor: __created__
    isMetadata: true
    skipPersist: false
    csvCandidate: true
    isInline: false
config:
  enable_show_state: false
  group_folder_column: view_state
  remove_field_when_delete_column: true
  show_metadata_created: true
  show_metadata_modified: false
filters:
  - {field: Year, operator: GREATER_THAN_OR_EQUAL,value: 2000}
%%>
```