## Database relations

### Introduction
Relations are a very important part of any database. They allow you to model complex relationships between your data. For example, a `User` can have many `Post`s, and a `Post` can have many `Comment`s. This is a one-to-many relationship. You can also have many-to-many relationships, where a `User` can have many `Post`s, and a `Post` can have many `User`s.

### How to use

To create a relation, you need to create a column with the `Relation` type. You can then select the table you want to relate to. You can also select the column you want to use as the relation key as `Rollup`. This is the column that will be used to match the rows. For example, if you have a `User` table with a `Name` column, and a `Post` table with an `Author` column, you can use the `Name` column as the relation key.

## Rollups

Once you create a relation, you can use the `rollup` function to get the related rows. For example, if you have a `User` table with a `Name` column, and a `Post` table with an `Author` column, you can use the `rollup` function to get all the posts for a given user.

### Methods
- Original value: shows the original value of the column as a list separated by commas.
- Summatory: Sum all the values of a column.
- Count All: Count all the values informed in a column.

See also [Rollup API](https://github.com/RafaelGB/obsidian-db-folder/blob/master/src/automations/Rollup.ts)