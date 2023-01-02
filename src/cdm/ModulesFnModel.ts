import { Literal } from "obsidian-dataview"
import { DateTime, DurationLikeObject } from "luxon";

type NumbersFnType = {
    sum: (values: Literal[]) => number;
    min: (values: Literal[]) => number;
    max: (values: Literal[]) => number;
    [key: string]: unknown
}

type LuxonFnType = {
    earliest: (values: Literal[]) => DateTime;
    latest: (values: Literal[]) => DateTime;
    range: (values: Literal[], dl?: keyof DurationLikeObject) => number;
    [key: string]: unknown
}

export type DatabaseFnType = {
    numbers: NumbersFnType;
    luxon: LuxonFnType;
    [key: string]: unknown
}