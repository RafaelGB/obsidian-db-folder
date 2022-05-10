import { parseYamlMock } from "mock/mockObsidianUtils";
import DatabaseStringToYamlParser from "parsers/DatabaseStringToYamlParser";
import { YamlHandlerResponse } from "parsers/handlers/AbstractYamlPropertyHandler";

jest.mock("obsidian",
    () => {

        return {
            parseYaml: jest.fn(() => {
                return parseYamlMock(1, 1);
            }
            ),
        };
    }
);
describe("Settings", () => {
    /** Parse string YAML */
    test("Parse Database string to Yaml", () => {
        const yamlResponse: YamlHandlerResponse = DatabaseStringToYamlParser("test");
        expect(yamlResponse.yaml.name).toBeDefined();
        expect(yamlResponse.yaml.description).toBeDefined();
        expect(yamlResponse.yaml.columns).toBeDefined();
        expect(yamlResponse.yaml.config).toBeDefined();
        expect(yamlResponse.yaml.filters).toBeDefined();
    });
});