import { FormulaFunctions } from "automations/formula_functions/FormulaFunctions";
import { IGenerateObject } from "automations/IGenerateObject";
import { LocalSettings } from "cdm/SettingsModel";
import { RowDataType } from "cdm/FolderModel";
import { Literal } from "obsidian-dataview";
export class FormulaGenerator implements IGenerateObject {
    public formula_functions: FormulaFunctions;

    constructor(private config: LocalSettings) {
        this.formula_functions = new FormulaFunctions(config);
    }

    private async generate_formula_functions(): Promise<Record<string, unknown>> {

        return await this.formula_functions.generate_object(this.config);
    }

    async generate_object(): Promise<Record<string, unknown>> {
        const final_object: Record<string, any> = {};
        Object.assign(final_object, {
            js: await this.generate_formula_functions(),
        });
        console.log("sasdinal_object");
        return final_object;
    }
}
