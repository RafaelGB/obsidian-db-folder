## Database Information

You can change the database name and description in the database settings.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197635940-0b3c351d-9325-408e-8711-71cf8830bccc.mov" type="video/mp4">
</video>

## Sticky First Column

You can make the first column sticky in the database settings to make it always visible even when scrolling horizontally.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636568-e5a50f5e-0e31-42ce-8067-d810d9643129.mov" type="video/mp4">
</video>

## Pagination

To help with displaying a lot of data, by default the database displays only 10 rows and allows changing the pages using the top bar. You can change the number of rows displayed per page in the database settings.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636349-f473a874-4c6a-434e-8b90-56aa05f368f6.mov" type="video/mp4">
</video>

## Row Height

In the database settings under `cell size`, you can change the row height between 3 options (compact, normal, wide).

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636446-9f17f8a7-baa5-4b7e-b910-557b0c5a478c.mov" type="video/mp4">
</video>

## Filtering

Using the database top bar, you can create one or multiple filters or you can search (normally or with regex) for any metadata displayed in the database.

You can either create a `filter` or a `group filter`. The difference is that a `group filter` can include many `filters` with either an **AND** or an **OR** type of relationship, whereas `filters` can only have an **AND** type of relationship between them.

You can create a `group filter` within a `group filter` for more granular filtering, and you can delete or rename them. Keep in mind that deleting a `parent group filter` will delete all the `children group filters` within it.

Each `group filter` will have a dedicated **named button** on the database top bar to quickly enable/disable it. It's important to note that the state of all the filters is determined by another button. So in this case, you have to enable both the **named button** and the **filter button** for `group filters` to work.

> The database filters hold priority over the dataview query source filters.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636117-9268cbbe-fcb4-464e-9840-4c966e503589.mov" type="video/mp4">
</video>

## Refresh Database

There is no actual refresh button, but you can use the `activate/desactive filter` button to refresh the database.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636392-0c1c17fa-8f21-47dc-8c1f-887ca96d4bab.mov" type="video/mp4">
</video>

## Sorting

You can sort one column or multiple columns from the column's menu in descending or ascending order. The sort priority is displayed as a number next the arrow in the column header. To remove the sort, just use the column menu.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636458-e322e245-3efa-4261-9578-58ff2eee4ad8.mov" type="video/mp4">
</video>

## Database Markdown

You can view the database markdown note by using the command `open as markdown` in obsidian menu or in the database menu. To re-enable the database view, just close the pane and re-open it again.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636284-ad2d5772-e65e-4e7b-bffa-fce53b52b16e.mov" type="video/mp4">
</video>

## Embedding Database

You can embed a database in another note by using this format `![[database file name.md]]`, it'll show a dataview query of the database.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197635963-e29dc482-09b0-4994-b861-ac57c85a583b.mov" type="video/mp4">
</video>

## Exporting Data

You can export the database into **CSV** format using the database menu.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636017-c4a1d9df-75c1-437e-924f-23d444658fb5.mov" type="video/mp4">
</video>

## Importing Data

You can upload a **CSV** file and turn it into a database using the database menu. The **CSV** file has to have a header row and before importing you need to define the column used to create the files in the plugin global settings under `CSV section > mandatory header key`.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636176-44eeaeb3-a753-4afc-b96b-4072b2e87fca.mov" type="video/mp4">
</video>