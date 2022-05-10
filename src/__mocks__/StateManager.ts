import { App, FileStats, TFolder, Vault } from "obsidian";
import {
    mock,
} from "jest-mock-extended";
import { DatabaseView } from "DatabaseView";
import { DatabaseSettings } from "Settings";
import { jest } from '@jest/globals';
const StateManager = jest.mock("StateManager", () => {
    return {
        StateManager: jest
            .fn()
            .mockImplementation(
                (
                    app: App,
                    initialView: DatabaseView,
                    initialData: string,
                    onEmpty: () => void,
                    getGlobalSettings: () => DatabaseSettings
                ) => {
                    return {
                        file: {
                            path: "mockedPath",
                            basename: "mockedBasename",
                            name: "mockedName",
                            parent: mock<TFolder>(),
                            vault: mock<Vault>(),
                            stat: mock<FileStats>(),
                            extension: "md",
                        },
                    };
                }
            ),
    };
});

module.exports = StateManager;