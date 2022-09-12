import { IGenerateObject } from "../IGenerateObject";
import { UserScriptFunctions } from "./ScriptFunctions";
import { LocalSettings } from "cdm/SettingsModel";

export class FormulaFunctions implements IGenerateObject {
    // private user_system_functions: UserSystemFunctions;
    private user_script_functions: UserScriptFunctions;

    constructor(private config: LocalSettings) {
        // this.user_system_functions = new UserSystemFunctions(app, plugin);
        this.user_script_functions = new UserScriptFunctions(config);
    }

    async generate_object(
        config: LocalSettings
    ): Promise<Record<string, unknown>> {
        let user_script_functions = {};

        // if (this.plugin.settings.enable_system_commands) {
        //     user_system_functions =
        //         await this.user_system_functions.generate_object(config);
        // }

        // user_scripts_folder needs to be explicitly set to '/' to query from root
        if (config.formula_folder_path) {
            user_script_functions =
                await this.user_script_functions.generate_object();
        }

        return {
            ...user_script_functions,
        };
    }
}
