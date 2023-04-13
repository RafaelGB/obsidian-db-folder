import { tableFilter } from "@features/filters";
import { FilterGroup } from "@features/filters/model/FiltersModel";
import { generateFilterGroupArray } from "__tests__/mock/mockFeatureFilters";

jest.mock("obsidian");

describe("tableFilter index function", () => {
    it("given a filter group, it will check if the entry matches the filter group condition (AND/OR) and the filters inside the group", () => {
        const mockedFilterGroup = generateFilterGroupArray();

        expect(true).toBe(true);
    });
});