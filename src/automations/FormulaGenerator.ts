import { FormulaFunctions } from "./user_functions/FormulaFunctions";
import { IGenerateObject } from "./IGenerateObject";
import * as obsidian_module from "obsidian";
import { LocalSettings } from "cdm/SettingsModel";

export enum FunctionsMode {
    INTERNAL,
    USER_INTERNAL,
}

export class FormulaGenerator implements IGenerateObject {
    public formula_functions: FormulaFunctions;

    constructor(private config: LocalSettings) {
        this.formula_functions = new FormulaFunctions(config);
    }

    async init(): Promise<void> {
    }

    additional_functions(): Record<string, unknown> {
        return {
            obsidian: obsidian_module,
        };
    }

    async generate_object(
        config: LocalSettings,
        functions_mode: FunctionsMode = FunctionsMode.USER_INTERNAL
    ): Promise<Record<string, unknown>> {
        const final_object = {};
        const additional_functions_object = this.additional_functions();
        const internal_functions_object =
            await this.formula_functions.generate_object(config);
        let user_functions_object = {};

        Object.assign(final_object, additional_functions_object);
        switch (functions_mode) {
            case FunctionsMode.INTERNAL:
                Object.assign(final_object, internal_functions_object);
                break;
            case FunctionsMode.USER_INTERNAL:
                user_functions_object =
                    await this.formula_functions.generate_object(config);
                Object.assign(final_object, {
                    ...internal_functions_object,
                    user: user_functions_object,
                });
                break;
        }

        return final_object;
    }
}
