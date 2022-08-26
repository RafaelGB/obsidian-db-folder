import { suggesterFilesInFunctionOf } from "components/obsidianArq/NoteSuggester";
import { mockReset, mockDeep, DeepMockProxy } from "jest-mock-extended";
import { generateTFileMock } from "mock/mockObsidianUtils";

describe("Components.Cells.editSuggester", () => {
    // @ts-ignore
    const mockGlobalApp: DeepMockProxy<App> = mockDeep<App>({
        metadataCache: {
            getLinkSuggestions: () => {
                return [generateTFileMock()];
            },
        }
    });
    /**
     * Run this before each test.
     */
    beforeAll(() => {
        mockReset(mockGlobalApp);
        global.app = mockGlobalApp;
    });
    test('fileSuggester', () => {
        suggesterFilesInFunctionOf("[[fileName");
        suggesterFilesInFunctionOf("![[fileName");
        suggesterFilesInFunctionOf("[[fileName#heading");
        suggesterFilesInFunctionOf("![[fileName#heading");
        suggesterFilesInFunctionOf("[[fileName#heading^block");
        suggesterFilesInFunctionOf("![[fileName#heading^block");
        expect(true).toBeTruthy();
    });

});