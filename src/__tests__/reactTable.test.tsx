import { render, screen } from "@testing-library/react";
import { Database } from "components/index/Database";
import { TableDataType } from "cdm/FolderModel";
import { makeData } from "mock/mockTableUtils";
import React from "react";
import {
  DeepMockProxy,
  mockDeep,
  mock,
  MockProxy,
  mockReset,
} from "jest-mock-extended";
import { App } from "obsidian";
import StateManager from "StateManager";

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
    //mockedTableData.stateManager = StateManager();
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
