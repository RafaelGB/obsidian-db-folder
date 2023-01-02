import { FormulaGenerator } from "automations/FormulaGenerator";
import { ModulesGenerator } from "automations/ModulesGenerator";
import Rollup from "automations/Rollup";
import { DatabaseFnType } from "cdm/ModulesFnModel";
import { LocalSettings } from "cdm/SettingsModel";
import { Link } from "obsidian-dataview/lib/data-model/value";
import { DataviewService } from "./DataviewService";

class AutomationService {
    private static instance: AutomationService;
    public coreFns: DatabaseFnType;

    async buildFns(config: LocalSettings) {
        const final_object: Record<string, unknown> = {};
        const jsObject = await new FormulaGenerator(config).generate_object();
        Object.assign(
            final_object,
            jsObject,
            {
                dataview: DataviewService.getDataviewAPI(),
                rollup: (relation: Link[]) => new Rollup(relation)
            },
            await this.getCoreFns()
        );
        return final_object;
    }

    async getCoreFns(): Promise<DatabaseFnType> {
        if (!this.coreFns) {
            const modulesGenerator = await new ModulesGenerator();
            await modulesGenerator.init();
            this.coreFns = await modulesGenerator.generate_object();
        }

        return this.coreFns;
    }

    /**
     * Singleton instance
     * @returns {VaultManager}
     */
    public static getInstance(): AutomationService {
        if (!this.instance) {
            this.instance = new AutomationService();
        }
        return this.instance;
    }
}

export const DbAutomationService = AutomationService.getInstance();