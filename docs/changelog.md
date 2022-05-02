## 0.1.0
### Shiny new things
- New button to download a CSV file with the current data (supports filtering!). Temporally this feature is inside menu bar. We are working on move it into the actual file options of Obsidian [ISSUE#15](https://github.com/RafaelGB/obsidian-db-folder/issues/15)
### Improved
- Now when you edit some cell, the plugin will check if the note has frontmatter and if the current column exist. If not it will be added automatically
- Headers are now static when you scroll down.

### Visual changes
- The search bar has been moved to a static menu bar

### No longer broken
- Now when you create a new note, the label of the file shows just the basename, not the full path.
- Add prefix to the className of components, so interference with other plugins is less probable. [ISSUE#19](https://github.com/RafaelGB/obsidian-bd-folder/issues/19)
- When column folder is activated and a file is moved, now link is updated correctly
## 0.0.7
*Published on 04/27/2022*
### Shiny new things
- New local property `group_folder_column` to specify a select column type column. This column will be used to group the notes into subfolders with the same cell value. The subfolder will be created if it does not exist. [ISSUE#11](https://github.com/RafaelGB/obsidian-bd-folder/issues/11)

### Improved
- Sustancial improvements with error handling.
- Beta of an error page if Config yaml is not parsed correctly with the details.
- Now if some core config is missing, the database will be created with the default values.
### No longer broken
- Now before render a database, it will check if dataview plugin is installed. Showing a warning message if not. [ISSUE#13](https://github.com/RafaelGB/obsidian-bd-folder/issues/13)
## 0.0.6
### No longer broken
- Fixed unable to add frontmatter to note after modify label [ISSUE#10](https://github.com/RafaelGB/obsidian-bd-folder/issues/10)
## 0.0.5
### Shiny new things
- Added Drag & Drop columns. Order is persisted [ISSUE#5](https://github.com/RafaelGB/obsidian-bd-folder/issues/5)
- Style background of the table is now adapted to the theme [PR#9](https://github.com/RafaelGB/obsidian-bd-folder/pull/9) [zubayrrr](https://github.com/zubayrrr)

### Developers
- State of table toggle configuration added. Show react table state at bottom of the page. It has a default value & local value of each dadabase.

## 0.0.4
### Shiny new things
- Global filters added

## 0.0.3
### Shiny new things
- Order rows `alphanumericFalsyLast`
- Label of columns now is editable
- Add new columns
- Delete columns
- Modify type of column

## 0.0.2
Initial version. Basic database view.
### Shiny `things`
- Cells are editable
- Cell can render markdown
- metadata columns added (just target file) Not configurable yet
### Developers
- LOGGER console configuration with 4 levels: debug, info, warn, error
