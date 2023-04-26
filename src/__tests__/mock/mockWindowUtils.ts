/**
 * Mocks the window.localStorage object
 * @returns 
 */
export const mockLocalStorage = () => {
    const localStorageMock = (function () {
        let store: Record<string, unknown> = {};

        return {
            getItem(key: string) {
                return store[key];
            },

            setItem(key: string, value: unknown) {
                store[key] = value;
            },

            clear() {
                store = {};
            },

            removeItem(key: string) {
                delete store[key];
            },

            getAll() {
                return store;
            },
        };
    })();

    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    const setItemMock = (id: string, data: unknown) => {
        if (typeof data === 'string') {
            window.localStorage.setItem(id, data);
        } else {
            window.localStorage.setItem(id, JSON.stringify(data));
        }
    };

    return {
        setItemMock
    }
};