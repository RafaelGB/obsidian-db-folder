## Footer

You can enable a footer from the database or plugin global setting under `Rows section`. You can choose between a number of options :

-   Percentage of empty cells
-   Percentage of cells with a value
-   Count of empty cells
-   Count of cells with a value
-   Count of unique values
-   Formula
-   Sum of number columns

## Filtering

You have to use the database top bar, which can be toggled by the search icon in the page header, or simply by using `CMD/CTRL+F`. You can create one or multiple filters or you can search (normally or with regex) for any metadata displayed in the database.

After opening the filter modal via the obsidian bar button or the command `DB Folder: Open filters`, you can either create a `filter` or a `group filter`. The difference is that a `group filter` can include many `filters` with either an **AND** or an **OR** type of relationship, whereas `filters` can only have an **AND** type of relationship between them.

You can create a `group filter` within a `group filter` for more granular filtering, and you can delete or rename them. Keep in mind that deleting a `parent group filter` will delete all the `children group filters` within it.

Each `group filter` will have a dedicated **named colored button** on the database top bar to quickly enable/disable it. It's important to note that the state of all the filters is determined by another button. So in this case, you have to enable both the **named button** and the **filter button** for `group filters` to work. You can also toggle the filter state by using the command `DB Folder: Toggle filters`.

You can also filter each column separately via the search filters which can be enabled by the icon on the top left.

> The database filters hold priority over the dataview query source filters.
> You can make search/filter bar always visible in the plugin global settings under `Helpers/Commands related to the table`

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636117-9268cbbe-fcb4-464e-9840-4c966e503589.mov" type="video/mp4">
</video>

## Refresh Database

The databaes should refresh after every change, but you can use the `activate/deactivate filter` button if you want to manually refresh it. On the other hand, you can disable auto-refreshing when an external change is detected in the plugin global settings.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636392-0c1c17fa-8f21-47dc-8c1f-887ca96d4bab.mov" type="video/mp4">
</video>

## Sorting

You can sort one column or multiple columns from the column's menu in descending or ascending order. The sort priority is displayed as a number next the arrow in the column header. To remove the sort, just use the column menu.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636458-e322e245-3efa-4261-9578-58ff2eee4ad8.mov" type="video/mp4">
</video>

## Embedding Database

You can embed a database in another note by using this format `![[database file name.md]]`, it'll show a dataview query of the database.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197635963-e29dc482-09b0-4994-b861-ac57c85a583b.mov" type="video/mp4">
</video>

## Exporting Data

You can export the database into **CSV** format using the obsidian page header.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636017-c4a1d9df-75c1-437e-924f-23d444658fb5.mov" type="video/mp4">
</video>

## Projects Plugin Integration

You can add a custom DB Folder view in the [projects plugin](https://github.com/marcusolsson/obsidian-projects).
