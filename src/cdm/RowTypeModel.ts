import { Link } from "obsidian-dataview";
import { RowSelectOption } from "cdm/RowSelectModel";
import NoteInfo from "services/NoteInfo";

export type RowType = number | string | boolean | Date | Link | RowSelectOption[] | NoteInfo;