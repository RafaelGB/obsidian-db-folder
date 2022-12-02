## Creating Blank Notes

You can create blank notes by clicking on the "+" icon the obsidian page header or by using the command `DB Folder: Add new row` which brings up the creation modal. Make sure you leave the template filed empty.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197633841-2e54a360-ce90-4b95-8032-34409fe4a1bc.mov" type="video/mp4">
</video>

## Creating Notes with a Template

You have to choose a template in the creation modal. You can filter the files suggested by adding a folder in the database or global plugin settings under `Rows section`.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197634718-98463157-f7d7-4323-87ab-e280211eeed7.mov" type="video/mp4">
</video>

> It works with the core template plugin. But with the templater plugin, you have to activate the option `Trigger templater on new file creation` in templater settings.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197634584-7420f211-bec2-4e0e-a031-dab809cbc1ab.mov" type="video/mp4">
</video>

## Creating Notes via Importing

You can upload a **CSV** file and turn it into a database using the obsidian page header. The **CSV** file has to have a header row and before importing you need to define the column used to create the files in the plugin global settings under `CSV section > mandatory header key`.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197636176-44eeaeb3-a753-4afc-b96b-4072b2e87fca.mov" type="video/mp4">
</video>

## Deleting & Renaming Notes

You can right-click on the numbers to the right of every row, to bring up a menu where you can delete or rename the note associated with the row.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197634302-a1081f6b-12da-40a5-a476-b222d4686b98.mov" type="video/mp4">
</video>

## Opening Note

You can either display a preview of the note inside the database by clicking on the numbers to the right. In this preview, you can't edit the file but you can check the tasks. You can also click on the link symbol to open the note in its own pane.

## Moving Notes Based on Metadata

The database will watch for changes in the select property column and create folders for each option present. The notes will be placed under the corresponding folder based on the option chosen. 

You can choose one or many select properties by which this rule will run. If you choose more than one, the folders will be nested and the nesting order will follow the order by which the select properties are added in the database settings. For example *"select1/select2/select3"*. This setting can be found under `configuration about columns > Columns to group by`.

You have additional settings to customize this rule under `configuration about columns` in the database settings :

1. By default, the folder is not created until you choose the corresponding select option. You can enable automatic folder creation which will not wait for changes and create the folders directly after setting the rule.
2. You can enable folder deletion if a folder is empty. Because, by default, if the select option is not chosen by any notes, in other words, the associated folder is empty, it is not deleted. Don't worry though, the folder will be created again if the appropriate select option is chosen.
3. When you're grouping by more than one select property. Let's say you have one note that has 2 select properties `select1/select2` with `select1 = something` and `select2 = (nothing)`. By default, because this note is missing one select property, it will be stored at the root of the folder used for storing the database notes. You can disable the setting `hoist files with missing attributes to root folder` and the note will be stored in the last used folder, in the example that would be the folder called `something`. 

> The `column name` and the `column id` have to be the same for this to work.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197634397-54e28827-6629-492a-a529-89ecd49622cd.mov" type="video/mp4">
</video>