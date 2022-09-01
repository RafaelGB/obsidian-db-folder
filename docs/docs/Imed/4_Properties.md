## Types
- **Text**: this property support markdown, links and tags ;
- **Number**: this property only accepts numbers ;
- **checkbox**: this property is represented by `1/0` in the underlying markdown ;
- **Date**: this property accepts dates with the format `YYYY-MM-DD` ;
- **Time**: this property accepts time with the format `YYYY-MM-DD hh:mm AM/PM` ;
- **Select**: this property accepts from a list of options you define. Colors are attributed automatically, though you can change them in the column setting. Furthermore, when removing the select option in the setting, it is also removed from the note's metadata ;
- **Tags**: similar to the previous property but instead of only selecting one option, you can select many options per cell ;
- **Image**: you can embed images in the `text` property in this format `![[image]]`. Make sure to enable `media links` in the column setting and ajust the dimensions too ;
- **Created time**: this column can be added only once from the database settings and will display the created time of the row ;
- **Modified time**: this column can be added only once from the database settings and will display the last modified time of the row ;
- **Tasks**: this column can be added only once from the database settings and will display the task of the given file. You can also choose to hide the completed tasks in the column settings.

> You can change the column property types, and if the format is right, it will be recognized by the plugin. Sometimes though, after converting, you won't see the changes until you refresh the database.

## YAML & dataview inline fields
The plugin works with yaml and dataview inline fields, but by default it looks for metadata in YAML. To make it work with inline fields, you'll have to change it in the column's settings. Keep in mind that this change will not convert the underlying yaml to inline format.

If there is no metadata in your notes, it will be created when you fill the corresponding cell in the database.