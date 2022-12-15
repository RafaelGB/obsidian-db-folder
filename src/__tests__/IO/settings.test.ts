import { YamlHandlerResponse } from "cdm/MashallModel";
import { mockReset, mockDeep, DeepMockProxy } from "jest-mock-extended";
import DatabaseStringToYamlParser from "parsers/DatabaseStringToYamlParser";
jest.mock("obsidian");

describe("Settings", () => {
    // @ts-ignore
    const mockGlobalApp: DeepMockProxy<App> = mockDeep<App>();
    /**
     * Run this before each test.
     */
    beforeAll(() => {
        mockReset(mockGlobalApp);
        global.app = mockGlobalApp;
    });
    /** Parse string YAML */
    test("Parse Database string to Yaml", () => {
        const yamlResponse: YamlHandlerResponse = DatabaseStringToYamlParser("This values does not matter - mocked response");
        expect(yamlResponse.yaml.name).toBeDefined();
        expect(yamlResponse.yaml.description).toBeDefined();
        expect(yamlResponse.yaml.columns).toBeDefined();
        expect(yamlResponse.yaml.config).toBeDefined();
        expect(yamlResponse.yaml.filters).toBeDefined();
    });
});