import { generateYamlColumns } from "mock/mockTableUtils";
import { DEFAULT_SETTINGS } from "helpers/Constants";
import { TFile } from "obsidian";

/* eslint-disable */
const { faker } = require("@faker-js/faker");

/** Mock parseYaml returning YamlHandlerResponse object */
export const parseYamlMock = (numOfColumns: number) => {
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


/** Mock TFile content */
export const generateTFileMock = (): TFile => {
    return {
        basename: faker.name.firstName(),
        path: faker.name.firstName(),
        extension: "md",
        vault: null,
        name: faker.name.firstName(),
        parent: null,
        stat: null
    };
}
