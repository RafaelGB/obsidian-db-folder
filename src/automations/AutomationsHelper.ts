import { LocalSettings } from "cdm/SettingsModel";
import { FormulaGenerator } from "automations/FormulaGenerator";

export async function obtainFormulasFromFolder(config: LocalSettings) {
    const generator = new FormulaGenerator(config);
    return await generator.generate_object();
}

