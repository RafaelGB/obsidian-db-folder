import { Literal } from "obsidian-dataview"

export type NumbersFnType = {
    sum: (values: Literal[]) => number;
    min: (values: Literal[]) => number;
    max: (values: Literal[]) => number;
    [key: string]: unknown
}

export type DatabaseFnType = {
    numbers: NumbersFnType;
    [key: string]: unknown
}