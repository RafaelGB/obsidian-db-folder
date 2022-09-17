import { LocalSettings } from "cdm/SettingsModel";
import { FormulaGenerator } from "automations/FormulaGenerator";
import { AutomationError, showDBError } from "errors/ErrorTypes";

export async function obtainFormulasFromFolder(config: LocalSettings) {
    try {
        const generator = new FormulaGenerator(config);
        return await generator.generate_object();
    } catch (e) {
        showDBError(AutomationError.LoadFormulas, e);
        return {};
    }
}

