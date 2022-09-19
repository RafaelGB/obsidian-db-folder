import { TFile } from "obsidian";
import { IGenerateObject } from "automations/IGenerateObject";
import { get_tfiles_from_folder } from "helpers/FileManagement";
import { LocalSettings } from "cdm/SettingsModel";
import { LOGGER } from "services/Logger";
import { AutomationError, showDBError } from "errors/ErrorTypes";

export class ScriptFunctions implements IGenerateObject {
    constructor(private config: LocalSettings) { }

    async generate_script_functions(
    ): Promise<Map<string, Function>> {
        const script_functions: Map<string, Function> = new Map();
        const files =
            get_tfiles_from_folder(
                this.config.formula_folder_path,
            );

        if (!files) {
            return new Map();
        }

        for (const file of files) {
            if (file.extension.toLowerCase() === "js") {
                try {
                    await this.load_script_function(
                        file,
                        script_functions
                    );
                } catch (e) {
                    showDBError({
                        error: AutomationError.LoadFormulas.error,
                        solution: `check your ${file.path} js file code`
                    }, e);
                }
            }
        }
        return script_functions;
    }

    async load_script_function(
        file: TFile,
        script_functions: Map<string, Function>
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
            const msg = `Failed to load script ${file.path}. No exports detected.`;
            LOGGER.error(msg);
            return;
        }
        if (!(formula_function instanceof Function)) {
            const msg = `Failed to load script ${file.path}. Default export is not a function.`
            LOGGER.error(msg);
            return;
        }
        script_functions.set(`${file.basename}`, formula_function);
    }

    async generate_object(): Promise<Record<string, unknown>> {
        const script_functions = await this.generate_script_functions();
        return Object.fromEntries(script_functions);
    }
}
