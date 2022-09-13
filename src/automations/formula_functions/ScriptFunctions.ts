import { Notice, TFile } from "obsidian";
import { IGenerateObject } from "automations/IGenerateObject";
import { get_tfiles_from_folder } from "helpers/FileManagement";
import { LocalSettings } from "cdm/SettingsModel";
import { LOGGER } from "services/Logger";

export class UserScriptFunctions implements IGenerateObject {
    constructor(private config: LocalSettings) { }

    async generate_user_script_functions(
    ): Promise<Map<string, Function>> {
        const user_script_functions: Map<string, Function> = new Map();
        const files =
            get_tfiles_from_folder(
                this.config.formula_folder_path,
            );

        if (!files) {
            return new Map();
        }

        for (const file of files) {
            if (file.extension.toLowerCase() === "js") {
                await this.load_user_script_function(
                    file,
                    user_script_functions
                );
            }
        }
        return user_script_functions;
    }

    async load_user_script_function(
        file: TFile,
        user_script_functions: Map<string, Function>
    ): Promise<void> {
        let req = (s: string) => {
            return window.require && window.require(s);
        };
        let exp: Record<string, unknown> = {};
        let mod = {
            exports: exp
        };

        const file_content = await app.vault.read(file);
        const wrapping_fn = window.eval("(function anonymous(require, module, exports){" + file_content + "\n})");
        wrapping_fn(req, mod, exp);
        const formula_function = exp['default'] || mod.exports;

        if (!formula_function) {
            const msg = `Failed to load user script ${file.path}. No exports detected.`;
            LOGGER.error(msg);
            new Notice(
                msg
                , 3000);
            throw new Error(msg);
        }
        if (!(formula_function instanceof Function)) {
            const msg = `Failed to load user script ${file.path}. Default export is not a function.`
            LOGGER.error(msg);
            new Notice(
                msg
                , 3000);
            throw new Error(msg);
        }
        user_script_functions.set(`${file.basename}`, formula_function);
    }

    async generate_object(): Promise<Record<string, unknown>> {
        const user_script_functions = await this.generate_user_script_functions();
        return Object.fromEntries(user_script_functions);
    }
}
