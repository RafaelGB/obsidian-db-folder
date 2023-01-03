import { FormulaGenerator } from "lib/FormulaGenerator";
import { ModulesGenerator } from "lib/ModulesGenerator";
import Rollup from "lib/Rollup";
import { DatabaseFnType } from "cdm/ModulesFnModel";
import { LocalSettings } from "cdm/SettingsModel";
import { Link } from "obsidian-dataview/lib/data-model/value";
import { DataviewService } from "./DataviewService";

class CoreService {
    private static instance: CoreService;
    public coreFns: DatabaseFnType;

    async init() {
        const modulesGenerator = await new ModulesGenerator();
        await modulesGenerator.init();
        this.coreFns = await modulesGenerator.generate_object();
    }

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
            this.coreFns
        );
        return final_object;
    }

    /**
     * Singleton instance
     * @returns {VaultManager}
     */
    public static getInstance(): CoreService {
        if (!this.instance) {
            this.instance = new CoreService();
        }
        return this.instance;
    }
}

export const Db = CoreService.getInstance();