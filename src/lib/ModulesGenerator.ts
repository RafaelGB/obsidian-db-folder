import { IGenerateObject } from "lib/core/IGenerateObject";
import { DatabaseFnType } from "cdm/ModulesFnModel";
import { DbModule } from "./core/DbModule";
import { LuxonFn } from "./core/modules/LuxonFn";
import { NumbersFn } from "./core/modules/NumbersFn";
import { ColorsFn } from "./core/modules/ColorsFn";
export class ModulesGenerator implements IGenerateObject {
    private modules_array: Array<DbModule> = [];

    constructor() {
        this.modules_array.push(new NumbersFn());
        this.modules_array.push(new LuxonFn());
        this.modules_array.push(new ColorsFn());
    }

    async init(): Promise<void> {
        for (const mod of this.modules_array) {
            await mod.init();
        }
    }

    async generate_object(): Promise<DatabaseFnType> {
        const internal_functions_object: { [key: string]: unknown } = {};
        for (const mod of this.modules_array) {
            internal_functions_object[mod.getName()] =
                await mod.generate_object();
        }

        return internal_functions_object as DatabaseFnType;
    }
}
