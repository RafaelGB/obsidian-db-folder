## Database Information

You can change the database name and description in the database settings.

## Sticky First Column

You can make the first column sticky in the database settings to make it always visible even when scrolling horizontally.

## Pagination

To help with displaying a lot of data, by default the database displays only 10 rows and allows changing the pages using the top bar. You can change the number of rows displayed per page in the database settings.

## Row Height

In the database settings under `cell size`, you can change the row height between 3 options (compact, normal, wide).

## Filtering

Using the database top bar, you can create one or multiple filters or you can search (normally or with regex) for any metadata displayed in the database.

You can either create a `filter` or a `group filter`. The difference is that a `group filter` can include many `filters` with either an **AND** or an **OR** type of relationship, whereas `filters` can only have an **AND** type of relationship between them.

You can create a `group filter` within a `group filter` for more granular filtering, and you can delete or rename them. Keep in mind that deleting a `parent group filter` will delete all the `children group filters` within it.

Each `group filter` will have a dedicated **named button** on the database top bar to quickly enable/disable it. It's important to note that the state of all the filters is determined by another button. So in this case, you have to enable both the **named button** and the **filter button** for `group filters` to work.

> The database filters hold priority over the dataview query source filters.

## Refresh Database

There is no actual refresh button, but you can use the `activate/desactive filter` button to refresh the database.

## Sorting

You can sort one column or multiple columns from the column's menu in descending or ascending order. The sort priority is displayed as a number next the arrow in the column header. To remove the sort, just use the column menu.

## Database Markdown

You can view the database markdown note by using the command `open as markdown` in obsidian menu or in the database menu.

## Embedding Database

You can embed a database in another note by using this format `![[database file name.md]]`, it'll show a dataview query of the database.

## Exporting Data

You can export the database into **CSV** format using the database menu.

## Importing Data

You can upload a **CSV** file and turn it into a database using the database menu. The **CSV** file has to have a header row and before importing you need to define the column used to create the files in the plugin global settings under `CSV section > mandatory header key`.