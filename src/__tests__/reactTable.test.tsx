import { render } from "@testing-library/react";
import React from "react";
import Relationship from "components/RelationShip";
import { grey } from "helpers/Colors";
jest.mock("obsidian");

describe("React-table", () => {
  test("TODO React testing", async () => {
    expect(true).toBeTruthy();
  });

  it("changes the class when hovered", () => {
    render(
      <Relationship
        option={{
          label: "MockedLabel",
          value: "MockedValue",
          color: grey(),
        }}
        view={null}
      />
    );
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
