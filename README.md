## Database folder plugin
This plugin is a Notion like database based on folders.

### How to use?
Database has its own type of view. It will search all notes into the same folder of the database and show the columns you specify

![TablePresentation.mov](docs/resources/TablePresentation.mov)
```markdown
---

database-plugin: basic

---
<%%
columns:
  titulo:
    input: text
    accessor: titulo
  director:
    input: text
    accessor: director
  año:
    input: text
    accessor: año
%%>
```

