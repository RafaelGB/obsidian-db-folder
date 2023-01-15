import { DateTime } from "luxon";
import { Db } from "services/CoreService";

jest.mock("obsidian");
describe("services: CORE", () => {
    beforeAll(() => {
        // Init the db service
        Db.init();
    });
    /**
     * LUXON MODULE
     */
    test('luxon service: dateToString', () => {
        const parsedString = Db.coreFns.luxon.dateToString(DateTime.now(), "yyyy-MM-dd");
        expect(typeof parsedString).toBe("string");
    });

    test('luxon service: stringToDate', () => {
        const parsedDate = Db.coreFns.luxon.stringToDate("2021-01-01", "yyyy-MM-dd");
        expect(DateTime.isDateTime(parsedDate)).toBe(true);
    });

    test('luxon service: earliest', () => {
        const date1 = DateTime.fromISO("2021-01-01");
        const date2 = DateTime.fromISO("2021-01-02");
        const earliest = Db.coreFns.luxon.earliest([date1, date2]);
        expect(earliest).toBe(date1);
    });

    test('luxon service: latest', () => {
        const date1 = DateTime.fromISO("2021-01-01");
        const date2 = DateTime.fromISO("2021-01-02");
        const lastest = Db.coreFns.luxon.latest([date1, date2]);
        expect(lastest).toBe(date2);
    });

    test('luxon service: range', () => {
        const date1 = DateTime.fromISO("2021-01-01");
        const date2 = DateTime.fromISO("2021-01-02");
        const range = Db.coreFns.luxon.range([date1, date2]);
        expect(range).toBe(1);
    });

    /**
     * NUMBERS MODULE
     */
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