import { mocked } from "ts-jest/utils";
import { render, screen } from "@testing-library/react";
import { Database } from "components/index/Database";
import { TableDataType } from "cdm/FolderModel";
import { makeData } from "mock/mockTableUtils";
import React from "react";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { App } from "obsidian";
import StateManager from "StateManager";
import { jest } from "@jest/globals";
/**
 * @jest-environment jsdom
 */
describe("React-table", () => {
  test("TODO React testing", async () => {
    expect(true).toBeTruthy();
  });
  // // @ts-ignore
  // const mockGlobalApp: DeepMockProxy<App> = mockDeep<App>();
  // const MockedStateManager = mocked(StateManager, true);
  // /**
  //  * Run this before each test.
  //  */
  // beforeAll(() => {
  //   mockReset(mockGlobalApp);
  //   global.app = mockGlobalApp;
  //   // Clears the record of calls to the mock constructor function and its methods
  //   MockedStateManager.mockClear();
  // });
  // test("Render without crashing", async () => {
  //   const mockedTableData: TableDataType = await makeData(10);
  //   mockedTableData.stateManager = new StateManager(
  //     global.app,
  //     null,
  //     null,
  //     null,
  //     null
  //   );
  //   render(<Database {...mockedTableData} />);
  //   const titleLabel = screen.getByText(" title");
  //   expect(titleLabel).toBeInTheDocument();
  // });
  // /**
  //  * Run this after each test.
  //  */
  // afterAll(() => {
  //   global.app = undefined;
  // });
});
