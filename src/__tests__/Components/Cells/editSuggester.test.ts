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
        expect(true).toBeTruthy();
    });

});