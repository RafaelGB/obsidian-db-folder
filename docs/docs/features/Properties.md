## Types

- **Text**: this property support markdown, links, and tags. If you're using links you can enable alias in the column settings or in the plugin global settings ;
- **Number**: this property only accepts numbers ;
- **Checkbox**: this property is represented by `true/false` in the underlying markdown ;
- **Date**: this property accepts dates. The default format is `yyyy-MM-dd`, but it can be changed in the plugin or database settings under `editing engine section > Date format` ;
- **Time**: this property accepts time. The default format is `yyyy-MM-dd HH:mm:ss`, but it can be changed in the plugin or database settings under `editing engine section > Datetime format` ;
- **Select**: this property accepts from a list of options you define. Colors are attributed automatically, though you can change them in the column settings. Furthermore, you can edit or remove the options from the column settings and the changes will be persisted on the notes' metadata ;
- **Tags**: similar to the previous property, but instead of only selecting one option, you can select multiples options per cell ;
- **Formulas**: property that accepts js code to return dynamic values in function of your code. See the [Formulas](/obsidian-db-folder/features/Formulas/) section for more details.
- **Image**: you can embed images in the `text` property in this format `![[image]]`. Make sure to enable `media links` in the column settings and adjust the dimensions too ;
- **Created time**: this column can be added only once from the database settings and will display the created time of the row ;
- **Modified time**: this column can be added only once from the database settings and will display the last modified time of the row ;
- **Tasks**: this column can be added only once from the database settings and will display the task of the given file. You can also choose to hide the completed tasks in the column settings ;
- **Inlinks**: this column can be added only once from the database settings and will display the files that have links to the select file ;
- **Outlinks**: this column can be added only once from the database settings and will display the files that have links from the select file ;
- **Relation** and **Rollup**: See the [Relations](/obsidian-db-folder/features/Relations/) section.

> You can change from one property type to another, and if the format is right, it will be recognized by the plugin.

## Column ID

Where you create a column, the `column name` (name displayed in the database) is the same as the `column id` (the metadata persisted in your notes). You can change the column ID in the column settings. This ID is used by the **filters**, so keep that in mind when choosing what column to filter.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197635378-256e2468-bb90-477f-8760-393f792777d6.mov" type="video/mp4">
</video>

## YAML & Dataview Inline Fields

The plugin works with YAML and dataview inline fields, but looks for metadata in YAML by default. To make it work with inline fields, you have two options :

- You can toggle `enable inline field as default` in database or plugin global settings, and you can choose between putting the inline fields at the top or the bottom of the file ;
- Or you can change it in the column's settings to use it with one property only. This change will not convert the underlying YAML to an inline format until you edit one of the cells in the column.

If there is no metadata in your notes, it will be created when you fill the corresponding cell in the database. 

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197635449-507ea33b-5213-4976-a7a2-bbb4e7b888b1.mov" type="video/mp4">
</video> 

## Nested Metadata

You can add nested metadata by writing something like `metadata1.metadata2` in the column setting under `Behavior > column id`, which will render nested metadata separated by one space :

```
---
metadata1:
 metadata2: something
---
```

If you want to add existing nested metadata, you'll have to abide by the format described above.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197635608-8c638ab0-1551-498f-b859-a9ab58eff34b.mov" type="video/mp4">
</video>

## Appearance

You can enable text wrapping and you can change the text alignment between `right-aligned`, `centered`, `left-aligned`, and `justified` from the column settings of the **text**, **number**, and **formula** properties.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197635327-31c273a1-6cb5-4283-a9a5-dddbdcc6b831.mov" type="video/mp4">
</video>