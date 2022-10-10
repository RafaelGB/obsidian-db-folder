## Creating Blank Notes

You can create blank notes by typing the name in the bottom bar while leaving the template field empty.

## Creating Notes with a Template

You have to choose a template in the bottom bar before creating the note. You can filter the files suggested in the bottom bar by adding a folder in the settings under `rows template file folder location`.

> It works with the core template plugin. But with the templater plugin, you have to activate the option `Trigger templater on new file creation` in templater settings.

## Deleting & Renaming Notes

You can click on the numbers to the right of every row, to bring up a menu where you can delete and rename the note associated with the row.

## Moving Notes Based on Metadata

The database will watch for changes in the select property column and create folders for each option present. The notes will be placed under the corresponding folder based on the option chosen. 

You can choose one or many select properties by which this rule will run. If you choose more than one, the folders will be nested and the nesting order will follow the order by which the select properties are added in the database settings. For example *"select1/select2/select3"*. This setting can be found under `configuration about columns > Columns to group by`.

You have additional settings to customize this rule under `configuration about columns` in the database settings :

1. By default, the folder is not created until you choose the corresponding select option. You can enable automatic folder creation which will not wait for changes and create the folders directly after setting the rule.
2. You can enable folder deletion if a folder is empty. Because, by default, if the select option is not chosen by any notes, in other words, the associated folder is empty, it is not deleted. Don't worry though, the folder will be created again if the appropriate select option is chosen.
3. When you're grouping by more than one select property. Let's say you have one note that has 2 select properties `select1/select2` with `select1 = something` and `select2 = (nothing)`. By default, because this note is missing one select property, it will be stored at the root of the folder used for storing the database notes. You can disable the setting `hoist files with missing attributes to root folder` and the note will be stored in the last used folder, in the example that would be the folder called `something`. 