## Types

- **Text**: this property support markdown, links, and tags. If you're using links you can enable alias in the column settings ;
- **Number**: this property only accepts numbers ;
- **Checkbox**: this property is represented by `true/false` in the underlying markdown ;
- **Date**: this property accepts dates. The default format is `yyyy-MM-dd`, but it can be changed in the plugin settings under `editing engine section > Date format` ;
- **Time**: this property accepts time. The default format is `yyyy-MM-dd HH:mm:ss`, but it can be changed in the plugin settings under `editing engine section > Datetime format` ;
- **Select**: this property accepts from a list of options you define. Colors are attributed automatically, though you can change them in the column setting. Furthermore, when removing the select option in the setting, it is also removed from the note's metadata ;
- **Tags**: similar to the previous property, but instead of only selecting one option, you can select multiples options per cell ;
- **Formulas**: property that accepts js code to return dynamic values in function of your code. See the [Formulas](/obsidian-db-folder/features/Formulas/) section for more details.
- **Image**: you can embed images in the `text` property in this format `![[image]]`. Make sure to enable `media links` in the column setting and adjust the dimensions too ;
- **Created time**: this column can be added only once from the database settings and will display the created time of the row ;
- **Modified time**: this column can be added only once from the database settings and will display the last modified time of the row ;
- **Tasks**: this column can be added only once from the database settings and will display the task of the given file. You can also choose to hide the completed tasks in the column settings ;
- **Inlinks**: this column can be added only once from the database settings and will display the files that have links to the select file ;
- **Outlinks**: this column can be added only once from the database settings and will display the files that have links from the select file.
> You can change from one property type to another, and if the format is right, it will be recognized by the plugin.

## YAML & Dataview Inline Fields

The plugin works with YAML and dataview inline fields, but by default, it looks for metadata in YAML. To make it work with inline fields, you have two options :

- You can toggle `enable inline field as default` in database or plugin setting, and you can choose between putting the inline fields at the top or at the bottom of the file ;
- Or you can change it in the column's settings to use it with one property only. Keep in mind that this change will not convert the underlying YAML to an inline format, it was meant to work with metadata already formatted as inline.

If there is no metadata in your notes, it will be created when you fill the corresponding cell in the database. 

## Alignment

You can change the text alignment inside the column setting between `right-aligned`, `centered`, and `left-aligned` for the **text**, **number**, and **formula** properties.