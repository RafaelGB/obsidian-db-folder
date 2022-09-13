Just like dataview, you can use multiple sources for your data :

1. **Current_folder**: this will match all files within the selected folder when creating the database;
2. **Tag**: this will match all files with the given tag ;
3. **Incoming_link**: this will match all files that have links to the select file ;
4. **Outgoing_link**: this will match all files that have links from the select file ;
5. **Dataview**: you can put your dataview query (DQL) without the first line `TABLE columns` as the plugin will autocomplete this part. For example : `FROM "folder" WHERE column = "something" SORT column ASC`.

If you right-clicked a folder or selected **current folder** as the source, the folder is used for storing the database and the new notes. But if you select any other source, you'll have to select where to store the new notes and where to store the database.

> If you want to combine multiple tags or links or folders, you'll have to use the **Dataview source**.
