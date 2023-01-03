import { NumbersInterface } from "cdm/ModulesFnModel";
import { DbModule } from "lib/core/DbModule";
import { Literal } from "obsidian-dataview";


export class NumbersFn extends DbModule implements NumbersInterface {
    public name: string = "numbers";

    async create_static_functions(): Promise<void> {
        this.static_functions.set("sum", this.sum.bind(this));
        this.static_functions.set("min", this.min.bind(this));
        this.static_functions.set("max", this.max.bind(this));
    }

    async create_dynamic_functions(): Promise<void> { }

    sum(rawValues: Literal[]): number {
        // Check if key is not truthy, return empty string
        return this
            .parseRaw(rawValues)
            .reduce((a, b) => a + b, 0);
    }

    min(rawValues: Literal[]): number {
        return this
            .parseRaw(rawValues)
            .reduce((acc: number, value: number) => Math.min(acc, value), Number.MAX_SAFE_INTEGER);
    }

    max(rawValues: Literal[]): number {
        return this
            .parseRaw(rawValues)
            .reduce((acc: number, value: number) => Math.max(acc, value), Number.MIN_SAFE_INTEGER);
    }


    private parseRaw(rawValues: Literal[]): number[] {
        return rawValues
            .filter((value) => value &&
                typeof value === "string" ||
                typeof value === "number")
            .map((value) => {
                return parseFloat(value.toString());
            }).filter((value) => {
                return !isNaN(value);
            });
    }
}
