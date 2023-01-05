## Row Number

To help with displaying a lot of data, by default the database displays only 10 rows and allows changing the pages using the numbers displayed in the bottom right or by using the commands `DB Folder: Go to previous/next page`. You can change the number of rows displayed per page in the database settings under `Rows section`, or you can change the default number of rows when creating a database in the global plugin settings.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636349-f473a874-4c6a-434e-8b90-56aa05f368f6.mov" type="video/mp4">
</video>

## Row Shadow

You can enable or disable alternate row shadowing in the plugin global settings under `Rows section`.

## Row Height

In the database settings under `cell size`, you can change the row height between 3 options (compact, normal, wide). There is also a global setting under `Folder adjustments` if you want to change the default behavior.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636446-9f17f8a7-baa5-4b7e-b910-557b0c5a478c.mov" type="video/mp4">
</video>

## Row Font Size

You can select the font size of the cells in the database settings, you can set a default font size in the plugin's global settings for all newly created databases.

## Row Navigation

You can navigate the cells by using `Tab` or the arrow keys. You can also edit each one by using the `Enter` key.

## Display Rows From Top to Bottom

If you don't use pagination, you can enable a full pane display of the rows by creating and enabling this CSS snippet. Keep in mind, though, that when enabling the search/filter bar, the last row will not be accessible.

```css
@media {
  .database-plugin__scroll-container {
    will-change: transform;
    width: 100%;
    height: 100%;
  }
}
```
