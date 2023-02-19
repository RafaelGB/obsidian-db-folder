import { Db } from "services/CoreService";

jest.mock("obsidian");
describe("services: colorsFn", () => {
    beforeAll(() => {
        // Init the db service
        Db.init();
    });
    test('colors service: greyScale', () => {
        const defaultValue = Db.coreFns.colors.greyScale();
        const customValue = Db.coreFns.colors.greyScale(1);

        // Regular expression to test if the string is a valid hex color
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        expect(hexColorRegex.test(defaultValue)).toBe(true);
        expect(hexColorRegex.test(customValue)).toBe(true);

        // Test when an invalid value is passed
        const invalidValue = Db.coreFns.colors.greyScale(100);
        expect(invalidValue).toBe(defaultValue);
    });

    test('colors service: randomColor', () => {
        const hslRandomValue = Db.coreFns.colors.randomColor();
        // Regular expression to test if the string is a valid hsl color
        const hslColorRegex = /^hsl\(\d{1,3},\s\d{1,3}%,\s\d{1,3}%\)$/;
        expect(hslColorRegex.test(hslRandomValue)).toBe(true);

    });

    test('colors service: parsing bidirectional hsl <-> string', () => {
        const hsl = { h: 1, s: 2, l: 3 };
        const hslString = Db.coreFns.colors.hslToString(hsl);
        const hslParsed = Db.coreFns.colors.stringtoHsl(hslString);

        expect(hslParsed).toEqual(hsl);
    });

    test('colors service: getContrast', () => {
        // Test with a black color (contrast should be white)
        const hsl = { h: 1, s: 2, l: 3 };
        const hslString = Db.coreFns.colors.hslToString(hsl);
        const contrast = Db.coreFns.colors.getContrast(hslString);

        expect(contrast).toBe('hsl(1,2%,80%)');

        // Test with a white color (contrast should be black)
        const hsl2 = { h: 1, s: 2, l: 98 };
        const hslString2 = Db.coreFns.colors.hslToString(hsl2);
        const contrast2 = Db.coreFns.colors.getContrast(hslString2);

        expect(contrast2).toBe('hsl(1,2%,20%)');
    });
});