## Formulas on dbfolder
You can use formulas to create dynamic values in your database. 
The formula is a javascript code that will be executed when the row is loaded.

## How to use
The code can be written in the column settings or in the note's metadata. 

### Exposed variables
- `row` : the row object
- `db` : the database object with predefined functions that can be used in the formula
- `config` : the table's config information

To use an exposed variable, use the `${}` syntax. For example, to get the value of the `Name` column, you can use `${row.Name}`.

### Exposed functions
The root object `db` has the following functions:
- `js` : execute a javascript function that you previously defined in the `js` folder of your table. (I.E.: `db.js.myFunction( arg1, arg2)`)

