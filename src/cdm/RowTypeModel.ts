import { Link } from "obsidian-dataview";
import { RowSelectOption } from "cdm/RowSelectModel";
import NoteInfo from "services/NoteInfo";
import { ConfigColumn } from "cdm/FolderModel";

export type RowType = number | string | boolean | Date | Link | RowSelectOption[] | NoteInfo | ConfigColumn;