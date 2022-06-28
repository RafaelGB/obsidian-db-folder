import { generateYamlColumns } from "mock/mockTableUtils";
import { DEFAULT_SETTINGS } from "helpers/Constants";

/** Mock parseYaml returning YamlHandlerResponse object */
export const parseYamlMock = (numOfColumns: number, numberOfFilters: number) => {
    return {
        name: "Test",
        description: "Test",
        columns: generateYamlColumns(numOfColumns),
        config: DEFAULT_SETTINGS.local_settings,
        filters: [
            {
                field: "test",
                operator: "NOT_EQUAL",
                value: "✅  Resolved"
            }
        ]
    };
}

