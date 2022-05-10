import { parseYaml } from "obsidian";

/** Mock parseYaml returning YamlHandlerResponse object */
export const parseYamlMock = (numOfColumns: number, numberOfFilters: number) => {
    return {
        name: "Test",
        description: "Test",
        columns: {
            "test": {
                input: "text",
                accessor: "test",
                label: "test",
                key: "test",
                position: 1,
                isMetadata: true,
                skipPersist: false,
                csvCandidate: true,
                isInline: false
            }
        },
        config: {
            enable_show_state: false,
            group_folder_column: "test"
        },
        filters: [
            {
                field: "test",
                operator: "NOT_EQUAL",
                value: "✅  Resolved"
            }
        ]
    };
}

