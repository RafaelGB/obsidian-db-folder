import { IGenerateObject } from "automations/IGenerateObject";
import { UserScriptFunctions } from "automations/formula_functions/ScriptFunctions";
import { LocalSettings } from "cdm/SettingsModel";

export class FormulaFunctions implements IGenerateObject {
    private js_script_functions: UserScriptFunctions;

    constructor(private config: LocalSettings) {
        this.js_script_functions = new UserScriptFunctions(config);
    }

    async generate_object(
        config: LocalSettings
    ): Promise<Record<string, unknown>> {
        let user_script_functions = {};

        if (config.formula_folder_path) {
            user_script_functions =
                await this.js_script_functions.generate_object();
        }

        return {
            ...user_script_functions,
        };
    }
}
