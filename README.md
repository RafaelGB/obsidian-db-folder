## Database folder plugin
This plugin is a Notion like database based on folders.

### How to use?
Database has its own type of view. It will search all notes into the same folder of the database and show the columns that you specify

![TablePresentation.mov](docs/resources/TablePresentation.mov)

The information you add or edit will be saved into the target obsidian note.

### Features
#### Rows
- Add new row
![AddNewRow.mov](docs/resources/AddNewRow.mov)
- Edit cells directly on table
#### Headers
- Add new column
- Edit label of existed column
- Delete column
- Order column ascending/descending
#### Filters
- Global filters
![GlobalFilter.mov](docs/resources/GlobalFilter.mov)

### Whats inside the database view?
Database view read the yaml configuration inside .md file and render a react DOM.

You can edit directly the yaml configuration inside the .md file or use the table features to edit the columns.
```markdown
---

database-plugin: basic

---
<%%
name: undefined
description: undefined
columns:
  1:
    input: text
    accessor: title
    label: title
    key: title
  2:
    input: text
    accessor: director
    label: director
    key: director
  3:
    input: number
    accessor: Year
    label: Year
    key: Year
  5:
    input: select
    accessor: Calification
    label: Calification
    key: Calification
%%>
```