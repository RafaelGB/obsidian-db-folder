## 2.8.4
### Shiny new things
- New rollup. All task count [ISSUE#602](https://github.com/RafaelGB/obsidian-db-folder/issues/602)
- New db source, current folder without subfolders [ISSUE#281](https://github.com/RafaelGB/obsidian-db-folder/issues/281)
- Now row context menu will display with right click (long press on mobile). Left click will open the note.
### Improved
- Default values avaliable for cell size and sticky of first colum on global settings [ISSUE#358](https://github.com/RafaelGB/obsidian-db-folder/issues/358)
- New toggle global configuration to show/hide the row shadow [ISSUE#421](https://github.com/RafaelGB/obsidian-db-folder/issues/421)
- New column text configuration to customize the name of URL alias [ISSUE#356](https://github.com/RafaelGB/obsidian-db-folder/issues/356)
- Go to page of entry creation [ISSUE#332](https://github.com/RafaelGB/obsidian-db-folder/issues/332)
- Support for external links [ISSUE#232](https://github.com/RafaelGB/obsidian-db-folder/issues/232)
### No longer broken
- Error handler with not correct calendar formats. Use a default one [ISSUE#595](https://github.com/RafaelGB/obsidian-db-folder/issues/595)
- Relations of dataview sources are now filtered correctly
## 2.8.3
### Shiny new things
- Obsidian-projects support (experimental) [ISSUE#574](https://github.com/RafaelGB/obsidian-db-folder/issues/574)
### Improved
- `Select file as Column template` option improved. Now the columns does not replace the current ones, but add the new ones to the right of the current ones. [ISSUE#230](https://github.com/RafaelGB/obsidian-db-folder/issues/230)
### No longer broken
- Wrong atributtes order on CSV import fixed. [ISSUE#551](https://github.com/RafaelGB/obsidian-db-folder/issues/551)
- Value of filters now support special characters. [ISSUE#579](https://github.com/RafaelGB/obsidian-db-folder/issues/579)
- Relations are now correctly configured for dataview/tags sources [ISSUE#572](https://github.com/RafaelGB/obsidian-db-folder/issues/572) [ISSUE#573](https://github.com/RafaelGB/obsidian-db-folder/issues/573)
- Rename file function fixed for Obsidian 1.0.x
## 2.8.2
### Visual
- UX improvements for date picker and time picker
- Checkbox design improvements [randomsnowflake](https://github.com/randomsnowflake)
### No longer broken
- Tags are now properly saved when it's a number with decimals with zero at the end (e.g. 1.0, 1.00, 1.000, etc.)
- Datepicker clear button now works properly [ISSUE#564](https://github.com/RafaelGB/obsidian-db-folder/issues/564)
- Vertical scroll on mobile improved [ISSUE#488](https://github.com/RafaelGB/obsidian-db-folder/issues/488)
## 2.8.1
### Shiny new things
- New rollup functions: Count unique values,Truthy count, Falsy count, Percent empty, Percent filled, Task TODO, Task completed
- Rollup API improvements for use inside the formulas
### No longer broken
- Rollups now works with just 1 row inside the relation
- Edit engine works correctly with empty yaml when we remove the last field or change the last field to inline [ISSUE#553](https://github.com/RafaelGB/obsidian-db-folder/issues/553)
- Relations now works too with dataview sources [ISSUE#568](https://github.com/RafaelGB/obsidian-db-folder/issues/568)
- useEffect loop when we persisted a  formula in some cases fixed [ISSUE#569](https://github.com/RafaelGB/obsidian-db-folder/issues/569)
## 2.8.0
### Shiny new things
- Added video examples to the docs for each section [imeed166](https://github.com/imeed166)
- Relation/Rollups arrives! Now you can create a relation between two models and use it to create a rollup. Both with its own column properties. [ISSUE#53](https://github.com/RafaelGB/obsidian-db-folder/issues/53)
- `db.dataview` and `db.rollup` functions were included to use in your formulas. dataview returns the API of the dv plugin and rollup returns the predefined functions of dbfolder rollups (check [documentation](https://rafaelgb.github.io/obsidian-db-folder/features/Formulas/#exposed-variables))
### Visual
- formula textarea size calculated in funcion of length [ISSUE#518](https://github.com/RafaelGB/obsidian-db-folder/issues/518)
### No longer broken
- enter key listener bug for search input removed [ISSUE#546](https://github.com/RafaelGB/obsidian-db-folder/issues/546)
- add multiple tags at the same time do not cause a concurrency problem [ISSUE#555](https://github.com/RafaelGB/obsidian-db-folder/issues/555)
## 2.7.4
### Shiny new things
- names of tags are now editable (updating all the related rows) [ISSUE#443](https://github.com/RafaelGB/obsidian-db-folder/issues/443)
### Improved
- ddbb yaml now supports linter plugins [ISSUE#509](https://github.com/RafaelGB/obsidian-db-folder/issues/509)
- Enter event added to add tags on column settings [ISSUE#520](https://github.com/RafaelGB/obsidian-db-folder/issues/520)
- Improved nested matadata behaviour [ISSUE#500](https://github.com/RafaelGB/obsidian-db-folder/issues/500)
### Visual
- UX of navbar and addRow forms improved with some redesigns [ISSUE#534](https://github.com/RafaelGB/obsidian-db-folder/issues/534) [cesarpereira904](https://github.com/cesarpereira904)
### No longer broken
- problem with dataview query without any column informed fixed [ISSUE#531](https://github.com/RafaelGB/obsidian-db-folder/issues/531)
- Sorting dates and numbers is now more precise [ISSUE#507](https://github.com/RafaelGB/obsidian-db-folder/issues/507) [ISSUE#516](https://github.com/RafaelGB/obsidian-db-folder/issues/516) [ISSUE#533](https://github.com/RafaelGB/obsidian-db-folder/issues/533)
- CSV export button fixed. the bug was introduced in 2.7.3 [ISSUE#535](https://github.com/RafaelGB/obsidian-db-folder/issues/535)
## 2.7.3
### Improved
- Use of Obsidian 1.0 color picker [ISSUE#497](https://github.com/RafaelGB/obsidian-db-folder/issues/497)
### No longer broken
- Hotfix with rename ids breaking the rendering of the plugin [ISSUE#505](https://github.com/RafaelGB/obsidian-db-folder/issues/505)
## 2.7.2
### Shiny new things
- Edit nested metadata arrives! You can now edit nested metadata in the cell editor [ISSUE#442](https://github.com/RafaelGB/obsidian-db-folder/issues/442)
### Performance
- Editions use a new method to update the notes under a queue. It should prevent the plugin from locking the UI when editing a lot of notes or errors editing the same note multiple times
### No longer broken
- support for stack tabs. If a ddbb note is included Obsidian does not crash anymore [ISSUE#435](https://github.com/RafaelGB/obsidian-db-folder/issues/435)
- empty line was added if yaml did not exist editing inline fields [ISSUE#504](https://github.com/RafaelGB/obsidian-db-folder/issues/504)
## 2.7.1
- Hotfix for 2.7.0 of global settings developer options
- Experimental support for Objects on text fields
## 2.7.0
### Shiny new things
- Group filters are now available. You can now filter per condition (AND/OR) This is a huhe improvement for the user experience. Those groups could be enabled/disabled easily [ISSUE#268](https://github.com/RafaelGB/obsidian-db-folder/issues/268)
- Nested subfolders rules improvement! Use your select column types to create your subdolders with the deep that you need [ISSUE#431](https://github.com/RafaelGB/obsidian-db-folder/issues/431) [ycnmhd](https://github.com/ycnmhd)
- new options of nested subfolders to remove automatically empty folders and move all the rows in function of you configuration [ISSUE#183](https://github.com/RafaelGB/obsidian-db-folder/issues/183) [ycnmhd](https://github.com/ycnmhd)
- Improving add column UX [ISSUE#267](https://github.com/RafaelGB/obsidian-db-folder/issues/267)
- Improving select tag UX [ISSUE#408](https://github.com/RafaelGB/obsidian-db-folder/issues/408)
### Improved
- new option for enable/disble load js formulas on init [ISSUE#457](https://github.com/RafaelGB/obsidian-db-folder/issues/457)
### Visual
- flex-wrap for tags [GaboCapo](https://github.com/GaboCapo)
### No longer broken
- Add new line when the yaml of the frontmatter does not exist and we insert some field [ISSUE#450](https://github.com/RafaelGB/obsidian-db-folder/issues/450)
## 2.6.7
### Shiny new things
- New options for text columns: wrap and justify content [ISSUE#378](https://github.com/RafaelGB/obsidian-db-folder/issues/378)
### Improved
- Inline editions now support [] characters as wrap characters [ISSUE#413](https://github.com/RafaelGB/obsidian-db-folder/issues/413)
- Select column type now has the same style of tags to give them support for mobiles, also the UX is improved [ISSUE#401](https://github.com/RafaelGB/obsidian-db-folder/issues/401)
### No longer broken
- sticky first column is not transparent with the rest of the cells scrolling [ISSUE#424](https://github.com/RafaelGB/obsidian-db-folder/issues/424)
- Frontmatter editions now respect nested metadata [ISSUE#194](https://github.com/RafaelGB/obsidian-db-folder/issues/194)
- Bug persisting inline field when the frontmatter was empty [ISSUE#416](https://github.com/RafaelGB/obsidian-db-folder/issues/416)
## 2.6.6
- Hotfix of add row bottom position and min height of navbar
## 2.6.5
### Shiny new things
- new UX for the "Add a new page" and navigation menus [ISSUE#410](https://github.com/RafaelGB/obsidian-db-folder/issues/410) [Inspired by javiavid design](https://github.com/javiavid)
  - Option to hide add row form [ISSUE#359](https://github.com/RafaelGB/obsidian-db-folder/issues/359)
  - Line numbers are shown on row context menu [ISSUE#258](https://github.com/RafaelGB/obsidian-db-folder/issues/258)
  - Shade alternate rows [ISSUE#290](https://github.com/RafaelGB/obsidian-db-folder/issues/290)
  - This will improve the UX for mobile users too
### No longer broken
- Query tags are saved correctly now [ISSUE#411](https://github.com/RafaelGB/obsidian-db-folder/issues/411)
## 2.6.4
### Improved
- Filters refactor into a modal improving the UX and mobile experience [ISSUE#400](https://github.com/RafaelGB/obsidian-db-folder/issues/400)
- Select and tag displayed on alfabetical order [ISSUE#323](https://github.com/RafaelGB/obsidian-db-folder/issues/323)
- Existed column displayed on alfabetical order [ISSUE#306](https://github.com/RafaelGB/obsidian-db-folder/issues/306)
- new rows does not insert an empty yaml in favor of templates [ISSUE#403](https://github.com/RafaelGB/obsidian-db-folder/issues/403)
- Edit engine minor improvements. Now empty frontmatter is ignored
### No longer broken
- Number type problem with decimals and zero values solved [ISSUE#402](https://github.com/RafaelGB/obsidian-db-folder/issues/402)
- Navbar on mobiles improved (not perfect not) [392](https://github.com/RafaelGB/obsidian-db-folder/issues/392)
## 2.6.3
### Improved
- Translation architecture added. Now you can contribute to the translation of the plugin [ISSUE#386](https://github.com/RafaelGB/obsidian-db-folder/issues/386)
- Edit engine improved. Now the plugin not inserts frontmatter yaml if is empty [ISSUE#343](https://github.com/RafaelGB/obsidian-db-folder/issues/343)
### No longer broken
- error habndler of js formulas on load [ISSUE#396](https://github.com/RafaelGB/obsidian-db-folder/issues/396)
- now you can parse a db form another db [ISSUE#398](https://github.com/RafaelGB/obsidian-db-folder/issues/398)
- Problem of portal components with Obsidian .16 resolved [ISSUE#395](https://github.com/RafaelGB/obsidian-db-folder/issues/395)
- Problem with save columns if quotes wrapped is enabled was resolved [ISSUE#399](https://github.com/RafaelGB/obsidian-db-folder/issues/399)
## 2.6.2
### Shiny new things
- aligment options for every column (text,number and formula) [ISSUE#292](https://github.com/RafaelGB/obsidian-db-folder/issues/292)
- Option for make inline fields as default [ISSUE#304](https://github.com/RafaelGB/obsidian-db-folder/issues/304)
- Option to choose where to save new inline fields (top or bottom)[ISSUE#304](https://github.com/RafaelGB/obsidian-db-folder/issues/304)
- Option to persist formulas (make them sortable and searchable) [ISSUE#387](https://github.com/RafaelGB/obsidian-db-folder/issues/387)
- Configurable Date format [ISSUE#297](https://github.com/RafaelGB/obsidian-db-folder/issues/297)
## 2.6.1
- hotfix of global settings and a partial regresion of [ISSUE#375](https://github.com/RafaelGB/obsidian-db-folder/issues/375) cause some columns could not be shown
## 2.6.0
### Shiny new things
- New column type: `Formulas`! You can configure you own formula inside  the column settings. Check our documentation for more details [here](https://rafaelgb.github.io/obsidian-db-folder/features/Formulas/) [ISSUE#49](https://github.com/RafaelGB/obsidian-db-folder/issues/49)
### No longer broken
- Group folders with dv query source now respect ther target folder for new entries [ISSUE#372](https://github.com/RafaelGB/obsidian-db-folder/issues/372https://github.com/RafaelGB/obsidian-db-folder/issues/372)
- Improved sorting to respect all the types of the table [ISSUE#371](https://github.com/RafaelGB/obsidian-db-folder/issues/371)
- Columns with special characters are allowed now with dv query source [ISSUE#375](https://github.com/RafaelGB/obsidian-db-folder/issues/375)
## 2.5.3
### No longer broken
- Sorting for created and modified dates working with new table version [ISSUE#368](https://github.com/RafaelGB/obsidian-db-folder/issues/368)
- Destination folder for query sources fixed [ISSUE#367](https://github.com/RafaelGB/obsidian-db-folder/issues/367)
## 2.5.2
### No longer broken
- hotfix about new rows and import csv rows. Link.file object of dataview just works if the Link is loaded first
- improving coexistence with old yamls
## 2.5.1
### No longer broken
- hotfix of persist saving introduced in 2.5.0 with the change of config centinel
## 2.5.0
*Published on 2022/09/11*
### Shiny new things
- Added support for mobile devices (iOS and Android) and tablets (iPad and Android tablets) [ISSUE#27](https://github.com/RafaelGB/obsidian-db-folder/issues/27)
- CSV import option included on menu [ISSUE#129](https://github.com/RafaelGB/obsidian-db-folder/issues/129)
- Global search now admit regex [ISSUE#169](https://github.com/RafaelGB/obsidian-db-folder/issues/169)
- New metadata options from dataview: Inlinks and Outlinks [ISSUE#170](https://github.com/RafaelGB/obsidian-db-folder/issues/170)
### Improved
- Button to clear date and datetime fields [ISSUE#160](https://github.com/RafaelGB/obsidian-db-folder/issues/160)
- New option to add an alias for all url links per column [ISSUE#157](https://github.com/RafaelGB/obsidian-db-folder/issues/157)
### No longer broken
- Yaml config centinel was changed to convive with Templater plugin [ISSUE#179](https://github.com/RafaelGB/obsidian-db-folder/issues/179)
- onBlur did not work well on empty text cells [ISSUE#352](https://github.com/RafaelGB/obsidian-db-folder/issues/352)
- DnD conflicts with resize fixed [ISSUE#349](https://github.com/RafaelGB/obsidian-db-folder/issues/349)
- Dark mode for principal and filters menu [ISSUE#350](https://github.com/RafaelGB/obsidian-db-folder/issues/350)
## 2.4.1
*Published on 2022/09/09*
### Visual
- Search now indicate the number of avaliable rows always, not just like placeholder [ISSUE#130](https://github.com/RafaelGB/obsidian-db-folder/issues/130)
### No longer broken
- FINALLY, DnD columns is enabled by default and the developer config about it was removed. It does not break Obsidian DnD anymore [ISSUE#239](https://github.com/RafaelGB/obsidian-db-folder/issues/239)
## 2.4.0
*Published on 2022/09/08*
### Shiny new things
- Totally renewed row context menu! Now wraps the obsidian context menu, so you can use all the plugins that add items to it(rename and delete file included as custom options too) [ISSUE#152](https://github.com/RafaelGB/obsidian-db-folder/issues/152)
- Created and modified columns now is rendered as daily link note using the complete date as alias [ISSUE#144](https://github.com/RafaelGB/obsidian-db-folder/issues/144)
### Improved
- Global search now ignore cases [ISSUE#340](https://github.com/RafaelGB/obsidian-db-folder/issues/340)
- File column is ordered alphabetically using filename instead of path with sort options [ISSUE#335](https://github.com/RafaelGB/obsidian-db-folder/issues/335)
- Checkbox edition save boolean values instead of 1 or 0 [ISSUE#158](https://github.com/RafaelGB/obsidian-db-folder/issues/158)
### Visual
- Tasks aligned to the left properly
- Open tags cell on the bottom of the table is displayed properly [ISSUE#139](https://github.com/RafaelGB/obsidian-db-folder/issues/139)
### No longer broken
- new yaml breaker conditions added (>)
- Edit a cell in a page out of the first one does not reset the pagination anymore [ISSUE#338](https://github.com/RafaelGB/obsidian-db-folder/issues/338)
## 2.3.6
*Published on 2022/09/07*
### Improved
- The tab title bar with Obsidian 0.16 is optional, so the settings of the ddbb where moved to the bar of the plugin itself [ISSUE#330](https://github.com/RafaelGB/obsidian-db-folder/issues/330)
### No longer broken
- render of checkbox fixed [ISSUE#334](https://github.com/RafaelGB/obsidian-db-folder/issues/334)
- order of multisort is persisted [ISSUE#324](https://github.com/RafaelGB/obsidian-db-folder/issues/324)
## 2.3.5
*Published on 2022/09/05*
### Shiny new things
- New command & ribbon icon to generate a new database with a helpful wizard to guide you through the process [ISSUE#126](https://github.com/RafaelGB/obsidian-db-folder/issues/126)
### No longer broken
- Problem with saving query on yaml solved [ISSUE#325](https://github.com/RafaelGB/obsidian-db-folder/issues/325)
## 2.3.4
*Published on 2022/09/04*
### Improved
- If you choose a source different of current folder, now you can select the destination of your new notes [ISSUE#318](https://github.com/RafaelGB/obsidian-db-folder/issues/318)
### No longer broken
- Hotfix of add a filter [ISSUE#322](https://github.com/RafaelGB/obsidian-db-folder/issues/322)
- Hotfix od delete a row in some cases [ISSUE#319](https://github.com/RafaelGB/obsidian-db-folder/issues/319)
## 2.3.3
*Published on 2022/09/02*
### Shiny new things
- New filter options: 'is not empty' and 'is empty' with visual improvements of auto resize [ISSUE#151](https://github.com/RafaelGB/obsidian-db-folder/issues/151)
### No longer broken
- Iterate between databases do not provoke blank screen anymore [ISSUE#309](https://github.com/RafaelGB/obsidian-db-folder/issues/309)
- Refresh of table after change option color and rename column if is sorted [ISSUE#305](https://github.com/RafaelGB/obsidian-db-folder/issues/305)
- Multi-sort respect priority now [ISSUE#299](https://github.com/RafaelGB/obsidian-db-folder/issues/299)
## 2.3.2
*Published on 2022/09/01*
### Shiny new things
- Inline fields with bold ,italics or underline key is edditable now. Also you can edit those inline fields wrapped with pharentesis in the middle of a line, respecting dataview readability [ISSUE#134](https://github.com/RafaelGB/obsidian-db-folder/issues/134)
- Remove options from columns settings of tag or select type now remove that option from all the rows too [ISSUE#121](https://github.com/RafaelGB/obsidian-db-folder/issues/121)
### Improved
- frontmatter embed links support [ISSUE#123](https://github.com/RafaelGB/obsidian-db-folder/issues/123)
### Visual
- Multi-column sort order information [ISSUE#127](https://github.com/RafaelGB/obsidian-db-folder/issues/127)
### No longer broken
- Enable frontmatter quotes wrapping does not break config that already has quotes [ISSUE#286](https://github.com/RafaelGB/obsidian-db-folder/issues/286)
- Problem refreshing column info after modifying the label solved [ISSUE#300](https://github.com/RafaelGB/obsidian-db-folder/issues/300)
## 2.3.1
### No longer broken
- new row hide last row [ISSUE#295](https://github.com/RafaelGB/obsidian-db-folder/issues/295)
- new row hide dbsettings using sliding panes [ISSUE#296](https://github.com/RafaelGB/obsidian-db-folder/issues/296)
- Pagination legend supports dark mode[ISSUE#291](https://github.com/RafaelGB/obsidian-db-folder/issues/291)
## 2.3.0
### Shiny new things
- Pagination arrived! Now you can organize your ddbb in pages, and you can choose the number of items per page in the settings panel. This also affects to the performance, so theoretically you can have a ddbb with more than 10000 items. [ISSUE#116](https://github.com/RafaelGB/obsidian-db-folder/issues/116)
- Autocomplete for links and tags in the editor of text column cells. Its an adaption of [Kanban plugin](https://github.com/mgmeyers/obsidian-kanban) feature, so it will be familiar to you. [ISSUE#107](https://github.com/RafaelGB/obsidian-db-folder/issues/107)
### Visual
- navbar and add row forms are now static with horizontal scroll. Thanks to [artisticat1](https://github.com/artisticat1)
### No longer broken
- Function of obtain all fields now respect uppercase [ISSUE#269](https://github.com/RafaelGB/obsidian-db-folder/issues/269)
- New rows title are now trimmed to ensure the functionality [ISSUE#279](https://github.com/RafaelGB/obsidian-db-folder/issues/279)
- Now you can hide/unhide metadata columns too [ISSUE#283](https://github.com/RafaelGB/obsidian-db-folder/issues/283)
## 2.2.2
### Shiny new things
- First steps of a row context menu. You can now remove a row from a table (and also Obsidian). [ISSUE#62](https://github.com/RafaelGB/obsidian-db-folder/issues/62)
### Improved
- Performance of DnD columns
- Performance of tasks column rendering
- Performance of editing any cell (micromanagement and just save global state without reload)
### Visual
- Calendar view z-index bug fixed [ISSUE#273](https://github.com/RafaelGB/obsidian-db-folder/issues/273)
### No longer broken
- Select group folder path fixed
- Date Datetime empty did not open correctly fixed [ISSUE#273](https://github.com/RafaelGB/obsidian-db-folder/issues/273)
- Label column now admits numbers only [ISSUE#274](https://github.com/RafaelGB/obsidian-db-folder/issues/274)
## 2.2.1
### Visual
- Opacity of new row form with sticky first column option [ISSUE#251](https://github.com/RafaelGB/obsidian-db-folder/issues/251)
### No longer broken
- menu of CSV button adapted to new version of MUI [ISSUE#263](https://github.com/RafaelGB/obsidian-db-folder/issues/263])
- Cast between calendar and text works well now. Does not require a refresh [ISSUE#266](https://github.com/RafaelGB/obsidian-db-folder/discussions/266)
- Global menu is avaliable again
### Developers
- Added an option to use DnD columns again with a toggle button. We are working on a better solution but while we are at it, at least this option is available
## 2.2.0
### Shiny new things
- Refactor of filters. With the new architecture of events (Zustand), it is now possible to use filters in a dynamic way, so they were moved to the navbar menu and the changes doe not need to refresh the page. [ISSUE#73](https://github.com/RafaelGB/obsidian-db-folder/issues/73)
- Button of enable/disable filters could be use as refresh button [ISSUE#163](https://github.com/RafaelGB/obsidian-db-folder/issues/163)
- New menu of add columns. You can now choose between existing columns or create a new one. [ISSUE#112](https://github.com/RafaelGB/obsidian-db-folder/issues/112)
- Option of hide/show columns. To enable show columns will be a section inside the new add column menu[ISSUE#79](https://github.com/RafaelGB/obsidian-db-folder/issues/79)
### Improved
- Tags could be sorted and filtered with the global search now [ISSUE#260](https://github.com/RafaelGB/obsidian-db-folder/issues/260)
### No longer broken
- Minor bugs with global search. Now is case sensitive and sanitized
## 2.1.2
### No longer broken
- drap/drop incompatibility with Obsidian was fixed [ISSUE#239](https://github.com/RafaelGB/obsidian-db-folder/issues/239)
- Split pane options was recovered [ISSUE#257](https://github.com/RafaelGB/obsidian-db-folder/issues/257)
## 2.1.1 (beta)
### Improved
- Resizing of columns performed better. [ISSUE#241](https://github.com/RafaelGB/obsidian-db-folder/issues/241)
### No longer broken
- Aligment issues when editing [ISSUE#246](https://github.com/RafaelGB/obsidian-db-folder/issues/246)
- Rename label does not affect order with zustand [ISSUE#247](https://github.com/RafaelGB/obsidian-db-folder/issues/247)
- Alter column key after modify the label [ISSUE#248](https://github.com/RafaelGB/obsidian-db-folder/issues/248)
- New rows accepts editions with zustand [ISSUE#254](https://github.com/RafaelGB/obsidian-db-folder/issues/254)
- Minor bug updating with zustand [ISSUE#245](https://github.com/RafaelGB/obsidian-db-folder/issues/245)
- new columns respect order[ISSUE#240](https://github.com/RafaelGB/obsidian-db-folder/issues/240)
## 2.1.0 (beta)
### Shiny new things
- The dispatcher of all events was migrated to Zustand! This means a better, more stable, and more efficient way to handle events. [Zustand](https://zustand.js.org/) is a library that provides a simple, efficient, and powerful way to manage state in React. Allowing future changes as formula columns. As PoC, this version update the value of `modified` column every time a cell is changed. [ISSUE#227](https://github.com/RafaelGB/obsidian-db-folder/issues/227)
### No longer broken
- qoutes inside of source query are now controlled [ISSUE#233](https://github.com/RafaelGB/obsidian-db-folder/issues/233) [jcdeichmann](https://github.com/jcdeichmann)
- Fix centered images of all notes [ISSUE#231](https://github.com/RafaelGB/obsidian-db-folder/issues/231)
- Fix LaTeX formulas presentation incompatibility [ISSUE#228](https://github.com/RafaelGB/obsidian-db-folder/issues/228)
- now is compatible with windows pane using `activeDocument`[ISSUE#199](https://github.com/RafaelGB/obsidian-db-folder/issues/199)
## 2.0.1
### No longer broken
-  Fixed selection problem with datetime columns introduced in 2.0.0.
## 2.0.0
### Shiny new things
- New style for navBar & "new row" button [ISSUE#206](https://github.com/RafaelGB/obsidian-db-folder/issues/206). Now the name of your ddbb is displayed in the navBar. To change it, just edit it into the settings.
### Improved
- Strategy of the filtering modifications. See more in this discussion [DISCUSSION#225](https://github.com/RafaelGB/obsidian-db-folder/discussions/225)

### Visual
- row template selector dark mode support [ISSUE#177](https://github.com/RafaelGB/obsidian-db-folder/issues/177)
- Improve the empty template width [ISSUE#175](https://github.com/RafaelGB/obsidian-db-folder/issues/175)
- Empty calendar cells will not show placeholder message. Just when are selected. [ISSUE#159](https://github.com/RafaelGB/obsidian-db-folder/issues/159)
### No longer broken
- Controling the duplicated columns using the file template option to create them. [ISSUE#224](https://github.com/RafaelGB/obsidian-db-folder/issues/224)
## 2.0.0-beta.4
### Improved
- Resizing do not move the column. It has its own slider
- The plugin shows a message when the edition fails including the error message. Common causes were added to the documentation [ISSUE#196](https://github.com/RafaelGB/obsidian-db-folder/issues/196)
### No longer broken
- do not lose the width property when a column is renamed [ISSUE#222](https://github.com/RafaelGB/obsidian-db-folder/issues/222)
- Edit inline fields are correctly saved [ISSUE#182](https://github.com/RafaelGB/obsidian-db-folder/issues/182)
- Where you add/delete new columns, there was ocasions where column order was not updated and provoked unselected columns [ISSUE#102](https://github.com/RafaelGB/obsidian-db-folder/issues/102)
## 2.0.0-beta.3
### Improved
- Delay of DnD improvements in the UI [ISSUE#214](https://github.com/RafaelGB/obsidian-db-folder/issues/214)
- Resizing of column is smoother [ISSUE#210](https://github.com/RafaelGB/obsidian-db-folder/issues/210)
### Visual
- new row button is aligned again with the new UI [ISSUE#208](https://github.com/RafaelGB/obsidian-db-folder/issues/208)
- Cell content is aligned again with the new UI [ISSUE#215](https://github.com/RafaelGB/obsidian-db-folder/issues/215) [artisticat1](https://github.com/artisticat1)
### No longer broken
- Control duplicates on tags and select columns [ISSUE#209](https://github.com/RafaelGB/obsidian-db-folder/issues/209)
- Sorting works with empty cells using a custom comparator (react-table not support it yet) [ISSUE#212](https://github.com/RafaelGB/obsidian-db-folder/issues/212)
## 2.0.0-beta.2
### Improved
- unwanted columns when populating based on all fields removed. Also the memory consumption of the table is reduced significantly [ISSUE#176](https://github.com/RafaelGB/obsidian-db-folder/issues/176)
### No longer broken
- empty cells can be selected again
- Now table config wraps the value with quotes [ISSUE#207](https://github.com/RafaelGB/obsidian-db-folder/issues/207)
## 2.0.0-beta.1
### Shiny new things
- new option of resizing a column. The Size is persisted. [ISSUE#50](https://github.com/RafaelGB/obsidian-db-folder/issues/50)
- Performance improvements of rendering components x5 [ISSUE#189](https://github.com/RafaelGB/obsidian-db-folder/issues/189)
### No longer broken
- Control label value before save changes [ISSUE#203](https://github.com/RafaelGB/obsidian-db-folder/issues/203)
### Developers
- Migration of React to React 18.x
- Migration of react-table-v7 to react-table-v8 (typescript native, compatibility with React 18.x)
- DnD library modified from react-beautiful-dnd to react-dnd ( compatibility with React 18.x )
- Material-ui migrated from Material-UI to MUI ( compatibility with React 18.x )
- Refactor of all components to be adapted to React 18.x
- Size of plugin from 16mb to 5mb
## 1.8.2
### No longer broken
- Hotfix of critical mapping bug [ISSUE#190](https://github.com/RafaelGB/obsidian-db-folder/issues/190)
## 1.8.1
### No longer broken
- Supports for popout windows. Create new ddbb with Obsidian v15 open a new pane instead of replace file manager [ISSUE#172](https://github.com/RafaelGB/obsidian-db-folder/issues/172)
- Create new rows with the task column enabled works well now [ISSUE#188](https://github.com/RafaelGB/obsidian-db-folder/issues/188)
## 1.8.0
### Shiny new things
- New source option: query. Use your own dataview query as source of the database. Start the query with the `FROM` term, since the plugin will autocomplete the beginning with `TABLE` and the column fields[ISSUE#156](https://github.com/RafaelGB/obsidian-db-folder/issues/156)
- Templates for new rows added! now you can choose a template folder on settings menu, then you can choose your template file easily near of the add row button[ISSUE#48](https://github.com/RafaelGB/obsidian-db-folder/issues/48)
### Improved
- Inline fields now supports render embed images with `![[note]]` syntax. [ISSUE#136](https://github.com/RafaelGB/obsidian-db-folder/issues/136)
- Now you can hide completed task on task column type [ISSUE#111](https://github.com/RafaelGB/obsidian-db-folder/issues/111)
- Now if your ddbb source is a tag, add a new row includes de tag too[ISSUE#94](https://github.com/RafaelGB/obsidian-db-folder/issues/94)
- New config property to wrap frontmatter values with quotes [ISSUE#117](https://github.com/RafaelGB/obsidian-db-folder/issues/117)
### No longer broken
- If you modify the label of a column, now exist an onMouseLeave event to blur the input and be more frieldly to the user interact with the next action without a double click (once for onBlur label edition and another for your next interaction) [ISSUE#114](https://github.com/RafaelGB/obsidian-db-folder/issues/114)
- Change the type of the column to checkbox respects the value `1` as marked and will not mark as `0` all by default [ISSUE#161](https://github.com/RafaelGB/obsidian-db-folder/issues/161)
## 1.7.2
### No longer broken
- add new rows hotfix. Was broken in 1.7.1 with refactor of datadispatch
## 1.7.1
### Shiny new things
- Create your columns easily with 2 new options. Choose a file as template or just take all the avaliable fields in your source! [ISSUE#39](https://github.com/RafaelGB/obsidian-db-folder/issues/39)
### Improved
- Now select source tags will be ordered alphabetically and the number of tags will be shown. [ISSUE#76](https://github.com/RafaelGB/obsidian-db-folder/issues/76)
## Visual
- Tag options supports dark mode [PR](https://github.com/RafaelGB/obsidian-db-folder/pull/133)[ISSUE#124](https://github.com/RafaelGB/obsidian-db-folder/issues/124) [artisticat1](https://github.com/artisticat1)
- Freeze column gap fixed [ISSUE#120](https://github.com/RafaelGB/obsidian-db-folder/issues/120) [artisticat1](https://github.com/artisticat1)
- Improvements of compact row mode [artisticat1](https://github.com/artisticat1)
### No longer broken
- More that one filter can be applied again to the same source. [ISSUE#113](https://github.com/RafaelGB/obsidian-db-folder/issues/113)
- You can not order by tags because was not prepared to do it yet (crashed). [ISSUE#119](https://github.com/RafaelGB/obsidian-db-folder/issues/119)
- Sorting state is not lost anymore when datadispatch is triggered[ISSUE#122](https://github.com/RafaelGB/obsidian-db-folder/issues/122)[ISSUE#125](https://github.com/RafaelGB/obsidian-db-folder/issues/125)
## 1.7.0
### Shiny new things
- New config option to choose the row height [ISSUE#69](https://github.com/RafaelGB/obsidian-db-folder/issues/69) [artisticat1](https://github.com/artisticat1)
- New config to freeze first column [ISSUE#51](https://github.com/RafaelGB/obsidian-db-folder/issues/51) [artisticat1](https://github.com/artisticat1)
- New type of column: Tags! Now you can select multiple options inside a cell powered with react-select component. Search of tags inside the form, control of duplicates, choose of tag colors inside the config and more! Frontmatter flavour saves the tags as yaml array. Inline flavour saves the tags as a string separated by commas [ISSUE#36](https://github.com/RafaelGB/obsidian-db-folder/issues/36)

### Improved
-  New button to remove the cell value easily of select column types
### Visual
- Visual improvements with selected tags, properties menu & calendars [PR#105](https://github.com/RafaelGB/obsidian-db-folder/pull/105) [artisticat1](https://github.com/artisticat1)
### No longer broken
- with subgroup config on, now file link is updated correctly [ISSUE#101](https://github.com/RafaelGB/obsidian-db-folder/issues/101)
- Error handler adding option labels on modal of selected columns ( and now tags too)
- Control of duplicated options during the load of database, leaving only one unique option
- Control of special character that potentially breaks yaml frontmatter [ISSUE#103](https://github.com/RafaelGB/obsidian-db-folder/issues/103)
## 1.6.3
*Published on 2022/06/04*
### No longer broken
- Duplicated column ids on new column button is controlled now [ISSUE#82](https://github.com/RafaelGB/obsidian-db-folder/issues/82)
- checkbox color supports all type of dark mode modes [ISSUE#85](https://github.com/RafaelGB/obsidian-db-folder/issues/85)
- Inconsistent name of calendar and calendar time headers fixed [ISSUE#86](https://github.com/RafaelGB/obsidian-db-folder/issues/86)
- Visual bug after deleting and adding the same column. The data was removed into the note but not into the table [ISSUE#83](https://github.com/RafaelGB/obsidian-db-folder/issues/83)
- Add column is out of draggable area now, so you cant dnd to the right [ISSUE#63](https://github.com/RafaelGB/obsidian-db-folder/issues/63)
- onBlur event when changing the name of a column now works correctly [ISSUE#96](https://github.com/RafaelGB/obsidian-db-folder/issues/96)
- `:` inside text cells now saves wrapped with `"your msg"` [ISSUE#90](https://github.com/RafaelGB/obsidian-db-folder/issues/90)
## 1.6.2
*Published on 2022/06/02*
### No longer broken
- There was some cases where editing a file without frontmatter does not create one. This is now fixed. [ISSUE#80](https://github.com/RafaelGB/obsidian-db-folder/issues/80)
## 1.6.1
*Published on 2022/06/01*
### No longer broken
- State of db columns is fixed after edit column label or create new column. That fix problem with persisting information correctly.
- Now label column edition not add _ instead of space.
## 1.6.0
*Published on 2022/05/30*
### Shiny new things
- Another kind of data sources of dataview are added(current folder will be avaliable too, of course) [ISSUE#59](https://github.com/RafaelGB/obsidian-db-folder/issues/59):
  - TAGs: select a tag from a list of all tags
  - INCOMING_LINKS: select a file from a list of all files
  - OUTGOING_LINKS: select a file from a list of all files

### No longer broken
- Filters of type "contains", "starts with" & "ends with" are fixed. A bug appears when original data was empty. [ISSUE#72](https://github.com/RafaelGB/obsidian-db-folder/issues/72)
## 1.5.1
*Published on 2022/05/29*
### Shiny new things
- Preview mode now renders a dataview table insead of markdown content! [ISSUE#41](https://github.com/RafaelGB/obsidian-db-folder/issues/41)
### Visual
- Support for darkmode to checkbox column
### No longer broken
- When new row is added and metadata column of created and modified is enabled, the metadata column is automatically filled with the current date and time instead of crashing.
## 1.5.0
*Published on 2022/05/27*
### Shiny new things
- To take advantage of the task column type architecture, Checkbox column type is added! Will be a 1 is checked, 0 is unchecked. (allows sorting & better performance)
- Improves to sorting columns: [ISSUE#67](https://github.com/RafaelGB/obsidian-db-folder/issues/67)
  - Sorting is persisted now.
  - Multi-column sorting is now possible.
  - You can remove sorting by clicking on the same header option again.

### Visual
- Text column style now justify the content of cells
- Sortable columns now have a sort icon [ISSUE#65](https://github.com/RafaelGB/obsidian-db-folder/issues/65)

### No longer broken
- Enable media links of text column type config could be edited correctly again
## 1.4.0
*Published on 2022/05/25*
### Shiny new things
- New metadata column: File tasks! You can see the tasks that are associated with each file and interact with them. Powered with tasklist render of dataview. [ISSUE#54](https://github.com/RafaelGB/obsidian-db-folder/issues/54)

### Improved
- Extra margin added to the botton and top of every cell is removed. Markdown obsidian renderer add html tagging that affected the margin.[ISSUE#71](https://github.com/RafaelGB/obsidian-db-folder/issues/71) [artisticat1](https://github.com/artisticat1)

### No longer broken
- Column settings that has a type without behavior section produce a console error no more and section tittle is not shown.
## 1.3.2
*Published on 2022/05/24*
### Improved
- Dataview Proxy DataArray are now supported. Parsed as a Array. That implies that few bugs are fixed relationated to load that kind of data.
- Order of frontmatter fields is now respected.
### No longer broken
- Yaml array frontmatter is edited correctly now. [ISSUE#61](https://github.com/RafaelGB/obsidian-db-folder/issues/61)
## 1.3.1
*Published on 2022/05/23*
### No longer broken
- dataview currently supports multiple key with same name and is considered as an array. Actually this kind of array generates an error in the database plugin. Now are controlled taking just the fist hit. It will be considered as an array with future versions.
- Add new label to selected cell type is duplicated no more. Introduced with 1.3.0 [ISSUE#64](https://github.com/RafaelGB/obsidian-db-folder/issues/64)
## 1.3.0
*Published on 2022/05/23*
### Shiny new things
- Refactor of column setting to Obsidian modal. Now every column will have its own configuration! As a consequence, the next point were possible:
  - Every text column can configure its own media settings
  - Options of Selected type column are now persistent. [ISSUE#58](https://github.com/RafaelGB/obsidian-db-folder/issues/58)
  - You can add new lavels even if does not exist in any cell (or delete it)
  - You can now select the color of the option label. [ISSUE#60](https://github.com/RafaelGB/obsidian-db-folder/issues/60)
### Improved
- The table will be refreshed when you close either the settings modal or the new modals of the column adjustments. This will suppose a minimal performance impact with a loading time of less than a second. Its a provisional solution until the refactor of react states stategy
## 1.2.0
*Published on 2022/05/19*
### Shiny new things
- URLs could be wrap as embed information [ISSUE#57](https://github.com/RafaelGB/obsidian-db-folder/issues/57)
- New configuration section to enable/disable embedding of URLs. You can choose heigth and width of the iframe.
## 1.1.3
*Published on 2022/05/18*
### No longer broken
- width of input calendar cells fixed [ISSUE#46](https://github.com/RafaelGB/obsidian-db-folder/issues/46)
- catastrofic regex failure fixed when `!` was present inside fields
## 1.1.2
*Published on 2022/05/17*
### No longer broken
- FIx edit bug added with 1.1.0 [ISSUE#47](https://github.com/RafaelGB/obsidian-db-folder/issues/47)
## 1.1.1
*Published on 2022/05/17*
### Improved
- Now rendered markdowns supports media preview with `![[wikilink.format]]` as video,audio and image. [ISSUE#17](https://github.com/RafaelGB/obsidian-db-folder/issues/17)
## 1.1.0
*Published on 2022/05/17*
### Shiny new things
- New type of column: Calendar time
- Now Text column supports Obsidian Markdown rendering (links, bold, italic, etc.) [ISSUE#35](https://github.com/RafaelGB/obsidian-db-folder/issues/35)
- MKdocs added as documentation tool of the project
### Improved
- New format of created and updated metadata columns allows sorting
### Developers
- Refactor of calendar column to support time as well. Changed the dependency of `react-calendar` to `react-datepicker` beacuse the onBlur event was not supported natively.

## 1.0.0
*Published on 2022/05/13*
### Shiny new things
- New type of column: Calendar [ISSUE#24](https://github.com/RafaelGB/obsidian-db-folder/issues/24)
- 2 new settings to show metadata file of created and modified using a toggle button [ISSUE#26](https://github.com/RafaelGB/obsidian-db-folder/issues/26)
- Now metadata columns can be sorted and add columns to the right or left
### Improved
- Type control using Literal of dataview. this will allow with futures versions the versatility of dataview plugin (images,links,...)
- Refactor of settings to control errors in case of something is missing with a marshall and unmarshall
### No longer broken
- Control of options as unique with Select column type
## 0.3.1
*Published on 2022/05/10*
### Shiny new things
- Option to enable/disable delete fields asociated with a column when you delete the column [ISSUE#28](https://github.com/RafaelGB/obsidian-db-folder/issues/28)
### No longer broken
- Resize window now do not affect the width of the table [ISSUE#34](https://github.com/RafaelGB/obsidian-db-folder/issues/34)
## 0.3.0
*Published on 2022/05/10*
### Shiny new things
- Dataview filters added on settings modal! Now you can filter the initial data obtained from the folder [ISSUE#33](https://github.com/RafaelGB/obsidian-db-folder/issues/33)
- Improve css styling [ISSUE#31](https://github.com/RafaelGB/obsidian-db-folder/pull/31) [artisticat1](https://github.com/artisticat1)
- ### Improved
- Added event of enter to create a new row [ISSUE#32](https://github.com/RafaelGB/obsidian-db-folder/issues/32)
### No longer broken
- Duplicated columns are now controled when you add it [ISSUE#32](https://github.com/RafaelGB/obsidian-db-folder/issues/32)
- DnD of columns is now scaling well the width.
## 0.2.2
*Published on 2022/05/08*
### No longer broken
- When you DnD a column and then edit the label, the column is not moved to the final. It mantains the same position. [ISSUE#30](https://github.com/RafaelGB/obsidian-db-folder/issues/30)
## 0.2.1
*Published on 2022/05/08*
### Improved
- Now when you press enter inside a text cell, it will ends the modification with onBlur event.
### No longer broken
- Create a column now adjust width automatically.
- total width of columns not broken anymore. This bug was introduced in 0.2.0
- Frontmatter fields that are not in the schema and were empty will not be insert a null value if a database field is updated. [ISSUE#29](https://github.com/RafaelGB/obsidian-db-folder/issues/29)
## 0.2.0
*Published on 2022/05/07*
### Shiny new things
- Edit inline fields are now supported! [ISSUE#25](https://github.com/RafaelGB/obsidian-db-folder/issues/25)
- Big refactor about edit engine to improve resiliency and performance
- new adjsutment section in column menu where, at the moment, you can select if column is of inline type or not
### Improved
- Now when you create a column, the field asociated is not inserted into all the rows. Just will be inserted when you edit the cell asociated.
## 0.1.2
*Published on 2022/05/04*
### Improved
- Now DnD of file column and persist order are supported. [ISSUE#18](https://github.com/RafaelGB/obsidian-db-folder/issues/18)
### No longer broken
- Change select cell type no crash the view anymore. This is a but introduced in 0.1.1.
## 0.1.1
*Published on 2022/05/03*
### Improved
- The width of columns are adjusted when a column is added of removed
### No longer broken
- Now if you update a cell and then use global filter, the value is updated correctly [ISSUE#23](https://github.com/RafaelGB/obsidian-db-folder/issues/23)
## 0.1.0
*Published on 2022/05/02*
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
*Published on 2022/04/27*
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
