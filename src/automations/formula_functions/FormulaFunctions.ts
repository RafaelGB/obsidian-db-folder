import { IGenerateObject } from "automations/core/IGenerateObject";
import { ScriptFunctions } from "automations/formula_functions/ScriptFunctions";
import { LocalSettings } from "cdm/SettingsModel";

export class FormulaFunctions implements IGenerateObject {
    private js_script_functions: ScriptFunctions;

    constructor(private config: LocalSettings) {
        this.js_script_functions = new ScriptFunctions(config);
    }

    async generate_object(
        config: LocalSettings
    ): Promise<Record<string, unknown>> {
        let user_script_functions = {};

        if (config.enable_js_formulas && config.formula_folder_path) {
            user_script_functions =
                await this.js_script_functions.generate_object();
        }

        return {
            ...user_script_functions,
        };
    }
}
