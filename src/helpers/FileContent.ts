import { NoteContentAction } from "cdm/FolderModel";

export class FileContent {
    public value: string;
    constructor(string: string) {
        this.value = string;
    }

    object(): string[] {
        return this.value.split('\n');
    }

    replaceAll(note: NoteContentAction): FileContent {
        note.regexp.forEach(
            (regex, index) => {
                this.value = this.value.replaceAll(
                    regex,
                    note.newValue[index]
                );
            }
        );

        return this;
    }

    remove(note: NoteContentAction): FileContent {
        const _object = this.object();
        _object.forEach((value, index) => {
            note.regexp.some(element => {
                if (value.match(element)) {
                    delete _object[index];
                    return true;
                }
            });
        });
        this.value = _object.join('\n');
        return this;
    }

    removeAll(string_to_be_removed: string): FileContent {
        const _object = this.object();
        _object.forEach((value, index) => {
            if (value.trim().indexOf(string_to_be_removed) != -1) {
                delete _object[index];
            }
        });
        this.value = _object.join('\n');
        return this;
    }

    fetch(line_number: number) {
        const _object = this.object();
        for (let i = 0; i < _object.length; i++) {
            if (i + 1 === line_number) {
                return _object[i];
            }
        }
        return null;
    }

    edit(content: string, line_number: number): FileContent {
        const _object = this.object();
        _object[line_number - 1] = content;
        this.value = _object.join('\n');
        return this;
    }
}