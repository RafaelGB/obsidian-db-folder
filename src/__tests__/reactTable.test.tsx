import { render, screen } from "@testing-library/react";
import { Database } from "components/index/Database";
import { TableDataType } from "cdm/FolderModel";
import { makeData } from "mock/mockUtils";
import React from "react";

/**
 * @jest-environment jsdom
 */
describe("React-table", () => {
  test("Render without crashing", async () => {
    const mockedTableData: TableDataType = await makeData(10);
    render(<Database {...mockedTableData} />);
    const titleLabel = screen.getByText(" title");
    expect(titleLabel).toBeInTheDocument();
  });
});
