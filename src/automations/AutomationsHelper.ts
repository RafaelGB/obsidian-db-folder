import { LocalSettings } from "cdm/SettingsModel";
import { FormulaGenerator } from "automations/FormulaGenerator";

export async function obtainFormulasFromFolder(config: LocalSettings) {
    const generator = new FormulaGenerator(config);
    generator.init();
    return await generator.generate_object(config);
}

