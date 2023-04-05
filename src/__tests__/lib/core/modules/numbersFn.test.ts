import { Db } from "services/CoreService";

jest.mock("obsidian");
describe("services: numbersFn", () => {
    beforeAll(() => {
        // Init the db service
        Db.init();
    });
    test('numbers service: sum', () => {
        const sum = Db.coreFns.numbers.sum([1, 2, 3]);
        expect(sum).toBe(6);
    });

    test('numbers service: min', () => {
        const min = Db.coreFns.numbers.min([1, 2, 3]);
        expect(min).toBe(1);
    });

    test('numbers service: max', () => {
        const max = Db.coreFns.numbers.max([1, 2, 3]);
        expect(max).toBe(3);
    });
});