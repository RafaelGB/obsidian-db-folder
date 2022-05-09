import { render, screen } from "@testing-library/react";
import { Database } from "components/index/Database";
import { TableDataType } from "cdm/FolderModel";
import { makeData } from "mock/mockTableUtils";
import React from "react";
import {
  DeepMockProxy,
  mockDeep,
  mock,
  mockReset,
  MockProxy,
} from "jest-mock-extended";
import { App, FileStats, TFolder, Vault } from "obsidian";
import StateManager from "StateManager";
import { DatabaseView } from "DatabaseView";

// void mock
const greetImplementation = (dataview: MockProxy<StateManager>) => {};
const mockFn = jest.fn(greetImplementation);

const mockStateManager: MockProxy<StateManager> = {
  app: global.app,
  file: {
    path: "mockedPath",
    basename: "mockedBasename",
    name: "mockedName",
    parent: mock<TFolder>(),
    vault: mock<Vault>(),
    stat: mock<FileStats>(),
    extension: "md",
  },
  onEmpty: jest.fn(),
  getGlobalSettings: jest.fn(),
  unregisterView: mockFn,
  registerView: jest.fn(),
  getAView: mock<DatabaseView>(),
  forceRefresh: jest.fn(),
};
/**
 * @jest-environment jsdom
 */
describe("React-table", () => {
  // @ts-ignore
  const mockGlobalApp: DeepMockProxy<App> = mockDeep<App>();
  /**
   * Run this before each test.
   */
  beforeAll(() => {
    mockReset(mockGlobalApp);
    global.app = mockGlobalApp;
  });

  test("Render without crashing", async () => {
    const mockedTableData: TableDataType = await makeData(10);
    mockedTableData.stateManager = mockStateManager;
    render(<Database {...mockedTableData} />);
    const titleLabel = screen.getByText(" title");
    expect(titleLabel).toBeInTheDocument();
  });

  /**
   * Run this after each test.
   */
  afterAll(() => {
    global.app = undefined;
  });
});
