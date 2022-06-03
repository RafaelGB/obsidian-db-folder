## Building Documentation

We use MkDocs for documentation (found in docs/). You'll need to have python and pip to run it locally:
```bash
foo@bar:~/obsidian-bd-folder$ pip3 install mkdocs mkdocs-material
foo@bar:~/obsidian-bd-folder$ cd docs
foo@bar:~/obsidian-bd-folder/docs$ mkdocs serve
```

This will start a local web server rendering the documentation in docs/docs, which will live-reload on change. Documentation changes are pushed to rafaelgb.github.io/obsidian-db-folder once they are merged to the main branch.