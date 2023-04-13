import { t } from "lang/helpers";
import { mockLocalStorage } from "__tests__/mock/mockWindowUtils";
describe("LANG.t", () => {
    test('t function call', () => {
        const { setItemMock } = mockLocalStorage();
        setItemMock('language', 'en');
        const testTranslationValue = t("confirm_modal_ok")
        expect(testTranslationValue).toBe('Yes');

    });
}); 