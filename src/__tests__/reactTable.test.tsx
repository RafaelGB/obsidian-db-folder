import { render, screen } from "@testing-library/react";
import { Database } from "components/index/Database";
import { TableDataType } from "cdm/FolderModel";
import { makeData } from "mock/mockUtils";
import React from "react";

/**
 * @jest-environment node || jsdom
 */
describe("React-table", () => {
  test("Render without crashing", () => {
    const mockedTableData: TableDataType = makeData(10);
    render(<Database {...mockedTableData} />);
    const titleLabel = screen.getByText(" title");
    expect(titleLabel).toBeInTheDocument();
  });
});
