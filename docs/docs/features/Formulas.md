## Formulas on Dbfolder

You can use formulas to create dynamic values in your database. 

The formula is a javascript code that will be executed when the row is loaded.

## How to Use

The code can be written in the column settings. The generated values can be added to the notes' metadata by enabling `persist formula output` in the column settings.

<video  width="670" controls>
  <source src="https://user-images.githubusercontent.com/38974541/197597294-aaf809e6-bb28-4e30-9e26-4281f6030236.mov" type="video/mp4">
</video>

### Exposed Variables

- `row` : the row object
- `db` : the database object with predefined functions that can be used in the formula
- `config` : the table's config information

To use an exposed variable, use the `${}` syntax. For example, to get the value of the `Name` column, you can use `${row.Name}`.

### Exposed Functions

The root object `db` has the following functions:

- `js` : execute a javascript function that you previously defined in the `js` folder of your table in the database or plugin global settings. (I.E.: `db.js.myFunction( arg1, arg2)`)
- `dataview`: expose the dataview API. (see [Dataview API](https://github.com/blacksmithgu/obsidian-dataview/blob/master/src/api/plugin-api.ts))
- `rollup`: expose the rollup functions of the dbfolder plugin.  (see [Rollup documentation](/features/Relations/#rollups))

#### Javascript file structure
To add a javascript file to the `js` folder, it must be a `.js` file and have the following structure:

```javascript
function optionalFunction( arg1, arg2){
    // do something
    return value
}

// Your main function inside the file (arguments are optional)
function myFunction(arg1, arg2) {
  // do something
  // You can use another functions defined in the file
  return result;
}

// expose the main function to the formula
module.exports = myFunction;
```

## Examples

If you have a column ID named "Date" you can add time:

- `${row.Date.plus({years: 1}).toFormat("DD")}` adds 1 year
- `${row.Date.plus({months: 1}).toFormat("DD")}` adds 1 month
- `${row.Date.plus({weeks: 1}).toFormat("DD")}` adds 1 week
- `${row.Date.plus({days: 1}).toFormat("DD")}` adds 1 day

Change the date format using 1st January 2000 1pm British Standard time as an example.

- `${row.Date.toFormat("y")}` or "yyyy" shows the year eg: **2000**
- `${row.Date.toFormat("yy")}` shows the last 2 digits of the year eg: **00**
- `${row.Date.toFormat("L")}` shows the month number eg: **1**
- `${row.Date.toFormat("LLL")}` shows the month short name eg: **Jan**
- `${row.Date.toFormat("LLLL")}` shows the month full name eg: **January**
- `${row.Date.toFormat("d")}` shows the day number eg: **1**
- `${row.Date.toFormat("D")}` shows day/month/year eg: **01/01/2000**
- `${row.Date.toFormat("DD")}` shows day/month(short name)/year eg: **01/Jan/2000**
- `${row.Date.toFormat("DDD")}` shows day/month(full name)/year eg: **01/January/2000**
- `${row.Date.toFormat("DDDD")}` shows day(name),day/month(full name)/year eg: **Saturday/January/2000**
- `${row.Date.toFormat("h")}` shows 12 hour time eg: **1**
- `${row.Date.toFormat("H")}` shows 24 hour time eg: **13**
- `${row.Date.toFormat("m")}` shows minute time eg: **00**
- `${row.Date.toFormat("f")}` shows day/month/year/ 24 hour time eg: **01/01/2000 13:00**
- `${row.Date.toFormat("ff"})` shows day/month(short name)/year/ 24 hour time eg: **01/Jan/2000 13:00**
- `${row.Date.toFormat("fff")}` shows day/month(full name)/year/ 24 hour time timezone eg: **01/January/2000 13:00 BST**
- `${row.Date.toFormat("ffff")}` shows day(name), day/month(full name)/year/ 24 hour time, full timezone eg: **Saturday, 01 January 2000, 13:00, British Summer Time** 

If you replace f with F then seconds will be included.

For further information go to the [Luxon Documentation](https://moment.github.io/luxon/#/).
