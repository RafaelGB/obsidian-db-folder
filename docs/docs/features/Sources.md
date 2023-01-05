## Types

Just like dataview, you can use multiple sources for your data :

1. **Current_folder**: this will match all files within the selected folder when creating the database. If you want to change the folder, just move the database to another folder ;
2. **Current folder without subfolders**: Just like the previous source, but doesn't recognize notes under subfolders ;
3. **Tag(s)**: this will match all files with the given tag(s) ;
4. **Incoming_link**: this will match all files that have links to the select file ;
5. **Outgoing_link**: this will match all files that have links from the select file ;
6. **Dataview**: you can put your dataview query (DQL) without the first line `TABLE columns` as the plugin will autocomplete this part. For example : `FROM "folder" WHERE column = "something" SORT column ASC`. Use this source if you want to combine multiple tags, links, or folders.

## Destination Folders

There are two types of destinations : 

1. Where you will store the database file ;
2. Where you will store the notes of the database.

If the source is `tag/incoming_link/outgoing_link/dataview`, you have to choose both types of destinations. But if you right-clicked a folder or the source is `current_folder with or without subfolders`, everything is stored under one folder, so you'll only choose once.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197635750-10d783f1-169a-4e6c-8c07-9c38dcf7938d.mov" type="video/mp4">
</video>
